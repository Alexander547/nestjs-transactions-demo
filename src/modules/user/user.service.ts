/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { ProfileService } from '../profile/profile.service';
import { Transactional } from '../../common/transactional.decorator';
import { EntityManager } from 'typeorm';

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

  /**
   * Crea un usuario, su perfil y envía notificación, todo dentro de una transacción.
   *
   * Este método está decorado con @Transactional(), por lo que:
   * - Todas las operaciones de base de datos se ejecutan en una única transacción.
   * - Si ocurre un error en cualquier paso, se hace rollback de todo.
   * - El EntityManager transaccional se inyecta como último argumento.
   *
   * @param email Email del usuario
   * @param name Nombre del usuario
   * @param phone Teléfono del usuario
   * @param bio Biografía para el perfil
   * @param manager (Inyectado automáticamente) EntityManager transaccional
   * @returns El usuario creado
   */
  @Transactional()
  async createUserTransactional(
    email: string,
    name: string,
    phone: string,
    bio: string,
    manager?: EntityManager,
  ) {
    // Usar el EntityManager transaccional
    const user = await manager!.save(User, {
      email,
      name,
      phone,
    });
    await this.profileService.createProfile(bio, user, manager!);
    await this.notificationService.sendWelcome(email, manager!);
    return user;
  }

  /**
   * Crea solo el usuario dentro de una transacción.
   *
   * Este método está decorado con @Transactional(), por lo que:
   * - Todas las operaciones de base de datos se ejecutan en una única transacción.
   * - Si ocurre un error, se hace rollback.
   * - El EntityManager transaccional se inyecta como último argumento.
   *
   * @param email Email del usuario
   * @param name Nombre del usuario
   * @param phone Teléfono del usuario
   * @param manager (Inyectado automáticamente) EntityManager transaccional
   * @returns El usuario creado
   */
  @Transactional()
  async createUserOnlyTransactional(
    email: string,
    name: string,
    phone: string,
    manager?: EntityManager,
  ) {
    // Solo crea el usuario usando el EntityManager transaccional
    const user = await manager!.save(User, {
      email,
      name,
      phone,
    });
    return user;
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
