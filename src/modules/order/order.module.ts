import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from '../notification/notification.service';
import { UserNotification } from '../notification/entities/notification.entity';
import { OrderItemService } from '../order-item/order-item.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, UserNotification]),
    DatabaseModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, NotificationService, OrderItemService],
  exports: [TypeOrmModule],
})
export class OrderModule {}
