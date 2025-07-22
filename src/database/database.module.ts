import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Profile } from '../modules/profile/entities/profile.entity';
import { UserNotification } from '../modules/notification/entities/notification.entity';
import { Order } from '../modules/order/entities/order.entity';
import { OrderItem } from '../modules/order-item/entities/order-item.entity';

@Module({
  providers: [
    {
      provide: 'SECONDARY_DATA_SOURCE',
      useFactory: async () => {
        const dataSource = new DataSource({
          name: 'secondary',
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'nest_transactions_secondary',
          entities: [User, Profile, UserNotification, Order, OrderItem],
          synchronize: true,
          logging: true,
        });
        return dataSource.initialize();
      },
    },
  ],
  exports: ['SECONDARY_DATA_SOURCE'],
})
export class DatabaseModule {}
