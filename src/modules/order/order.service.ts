/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, EntityManager } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { OrderItemService } from '../order-item/order-item.service';
import { Transactional } from '../../common/transactional.decorator';
import { TransactionalAdvanced } from '../../common/transactional-advanced.decorator';

@Injectable()
export class OrderService {
  static secondaryDataSource: DataSource;
  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
    private orderItemService: OrderItemService,
    @Inject('SECONDARY_DATA_SOURCE')
    private readonly secondaryDataSource: DataSource,
  ) {
    OrderService.secondaryDataSource = secondaryDataSource;
  }
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async createOrder(
    userId: number,
    items: { name: string; price: number }[],
  ): Promise<Order> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      // 1. Crear la orden
      const order = manager.create(Order, { userId });
      order.total = items.reduce((sum, item) => sum + item.price, 0);
      const savedOrder = await manager.save(order);

      // 2. Crear los ítems relacionados
      const orderItems = items.map((item) =>
        manager.create(OrderItem, {
          ...item,
          order: savedOrder, // establecer relación manualmente
        }),
      );
      await manager.save(orderItems);

      // 3. Devolver la orden con ítems cargados
      return {
        ...savedOrder,
        items: orderItems,
      };
    });
  }

  async createOrderWithItems(
    userId: number,
    items: { name: string; price: number }[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneByOrFail(User, {
        id: userId,
      });

      const order = new Order();
      order.user = user;
      order.total = items.reduce((sum, item) => sum + item.price, 0);

      const savedOrder = await queryRunner.manager.save(Order, order);

      await this.orderItemService.createMany(
        items,
        savedOrder,
        queryRunner.manager,
      );

      await this.notificationService.sendOrderCreated(
        user,
        savedOrder,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException({
        message: 'Error al crear la orden con sus items',
        cause: error.message,
      });
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Crea una orden y sus ítems relacionados, y envía notificación, todo dentro de una transacción.
   *
   * Este método está decorado con @Transactional(), por lo que:
   * - Todas las operaciones de base de datos se ejecutan en una única transacción.
   * - Si ocurre un error en cualquier paso, se hace rollback de todo.
   * - El EntityManager transaccional se inyecta como último argumento.
   *
   * @param userId ID del usuario que realiza la orden
   * @param items Lista de ítems a agregar a la orden
   * @param manager (Inyectado automáticamente) EntityManager transaccional
   * @returns La orden creada
   */
  @Transactional()
  async createOrderTransactional(
    userId: number,
    items: { name: string; price: number }[],
    manager?: EntityManager,
  ): Promise<Order> {
    try {
      const user = await manager!.findOneByOrFail(User, { id: userId });
      const order = new Order();
      order.user = user;
      order.total = items.reduce((sum, item) => sum + item.price, 0);
      const savedOrder = await manager!.save(Order, order);
      await this.orderItemService.createMany(items, savedOrder, manager!);
      await this.notificationService.sendOrderCreated(
        user,
        savedOrder,
        manager!,
      );
      return savedOrder;
    } catch (error) {
      throw new BadRequestException({
        message: 'Error al crear la orden con sus items (transaccional)',
        cause: error.message,
      });
    }
  }

  /**
   * Crea una orden y sus ítems usando el decorador avanzado TransactionalAdvanced.
   * Si ocurre un error, la transacción se revierte y se loggea el error.
   * Usa nivel de aislamiento SERIALIZABLE.
   */
  @TransactionalAdvanced({ logErrors: true, isolationLevel: 'SERIALIZABLE' })
  async createOrderAdvancedTransactional(
    userId: number,
    items: { name: string; price: number }[],
    manager?: EntityManager,
  ): Promise<Order> {
    const user = await manager!.findOneByOrFail(User, { id: userId });
    const order = new Order();
    order.user = user;
    order.total = items.reduce((sum, item) => sum + item.price, 0);
    const savedOrder = await manager!.save(Order, order);
    await this.orderItemService.createMany(items, savedOrder, manager!);
    await this.notificationService.sendOrderCreated(user, savedOrder, manager!);
    return savedOrder;
  }

  /**
   * Crea una orden y sus ítems en la base de datos secundaria, y envía notificación.
   *
   * Este método demuestra el uso de transacciones sobre un DataSource alternativo usando el decorador avanzado.
   *
   * Características:
   * - Ejecuta todas las operaciones en una transacción sobre la base 'nest_transactions_secondary'.
   * - Si ocurre un error, se hace rollback de todo.
   * - El nivel de aislamiento es 'READ COMMITTED'.
   * - Los errores se loggean automáticamente.
   *
   * @param userId ID del usuario que realiza la orden
   * @param items Lista de ítems a agregar a la orden
   * @param manager (Inyectado automáticamente) EntityManager transaccional de la base secundaria
   * @returns La orden creada (con sus ítems)
   */
  @TransactionalAdvanced({
    dataSource: OrderService.secondaryDataSource,
    logErrors: true,
    isolationLevel: 'READ COMMITTED',
  })
  async createOrderWithSecondaryDataSource(
    userId: number,
    items: { name: string; price: number }[],
    manager?: EntityManager,
  ): Promise<Order> {
    const user = await manager!.findOneByOrFail(User, { id: userId });
    const order = new Order();
    order.user = user;
    order.total = items.reduce((sum, item) => sum + item.price, 0);
    const savedOrder = await manager!.save(Order, order);
    await this.orderItemService.createMany(items, savedOrder, manager!);
    await this.notificationService.sendOrderCreated(user, savedOrder, manager!);
    return savedOrder;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
