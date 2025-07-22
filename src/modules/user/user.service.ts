/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    private notificationService: NotificationService,
    private profileService: ProfileService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async createUserWithTransaction(
    email: string,
    name: string,
    phone: string,
    bio: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.save(User, {
        email,
        name,
        phone,
      });

      // 👉 Pasa el mismo EntityManager a los otros servicios
      await this.profileService.createProfile(bio, user, queryRunner.manager);
      await this.notificationService.sendWelcome(email, queryRunner.manager);

      await queryRunner.commitTransaction(); // ✅ Todo OK
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction(); // ❌ Falla → Rollback de todo
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
