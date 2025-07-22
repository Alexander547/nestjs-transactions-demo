/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Order } from '../order/entities/order.entity';
import { EntityManager } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {
  create(createOrderItemDto: CreateOrderItemDto) {
    return 'This action adds a new orderItem';
  }

  /**
   * Crea múltiples ítems de orden asociados a una orden.
   *
   * Este método está diseñado para ser usado dentro de métodos decorados con @Transactional(),
   * por lo que espera recibir un EntityManager transaccional como argumento.
   * Si ocurre un error, la transacción será revertida por el método superior.
   *
   * @param items Lista de ítems a crear
   * @param order Orden a la que se asocian los ítems
   * @param manager EntityManager transaccional (proporcionado por el decorador)
   * @returns Lista de ítems creados
   */
  async createMany(
    items: CreateOrderItemDto[],
    order: Order,
    manager: EntityManager,
  ): Promise<OrderItem[]> {
    const savedItems: OrderItem[] = [];

    for (const itemDto of items) {
      if (itemDto.price > 1600) {
        throw new Error('Precio demasiado alto');
      }
      const item = new OrderItem();
      item.name = itemDto.name;
      item.price = itemDto.price;
      item.order = order;

      const savedItem = await manager.save(OrderItem, item);
      savedItems.push(savedItem);
    }

    return savedItems;
  }

  findAll() {
    return `This action returns all orderItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderItem`;
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
