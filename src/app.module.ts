import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { Profile } from './modules/profile/entities/profile.entity';
import { UserNotification } from './modules/notification/entities/notification.entity';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { NotificationModule } from './modules/notification/notification.module';
import { Order } from './modules/order/entities/order.entity';
import { OrderItem } from './modules/order-item/entities/order-item.entity';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order-item/order-item.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest_transactions',
      entities: [User, Profile, UserNotification, Order, OrderItem],
      synchronize: true, // ✅ Solo para desarrollo
      logging: true,
    }),
    UserModule,
    ProfileModule,
    NotificationModule,
    OrderModule,
    OrderItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
