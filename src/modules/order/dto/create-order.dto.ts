import { CreateOrderItemDto } from 'src/modules/order-item/dto/create-order-item.dto';

export class CreateOrderDto {
  userId: number;
  items: CreateOrderItemDto[];
}
