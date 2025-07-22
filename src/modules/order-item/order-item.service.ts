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
