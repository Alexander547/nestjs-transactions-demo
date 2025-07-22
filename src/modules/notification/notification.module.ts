import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserNotification, User, Order])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [TypeOrmModule],
})
export class NotificationModule {}
