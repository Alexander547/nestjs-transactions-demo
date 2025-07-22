import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from '../notification/notification.service';
import { ProfileService } from '../profile/profile.service';
import { UserNotification } from '../notification/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserNotification])],
  controllers: [UserController],
  providers: [UserService, NotificationService, ProfileService],
  exports: [TypeOrmModule],
})
export class UserModule {}
