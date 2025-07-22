/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource, EntityManager, Transaction } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { OrderItemService } from '../order-item/order-item.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
    private orderItemService: OrderItemService,
  ) {}
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
