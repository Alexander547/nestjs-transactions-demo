import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post('entity')
  async createOrder(
    @Body() body: { userId: number; items: { name: string; price: number }[] },
  ): Promise<Order> {
    return this.orderService.createOrder(body.userId, body.items);
  }

  @Post('transaccion')
  async createOrderWithItems(
    @Body()
    body: {
      userId: number;
      items: { name: string; price: number }[];
    },
  ) {
    return await this.orderService.createOrderWithItems(
      body.userId,
      body.items,
    );
  }

  @Post('tx')
  async createOrderTransactional(
    @Body() body: { userId: number; items: { name: string; price: number }[] },
  ) {
    return this.orderService.createOrderTransactional(body.userId, body.items);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
