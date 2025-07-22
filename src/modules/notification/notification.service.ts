/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserNotification } from './entities/notification.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(UserNotification)
    private notiRepo: Repository<UserNotification>,
  ) {}
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  /**
   * Envía una notificación de bienvenida a un usuario.
   *
   * Este método está diseñado para ser usado dentro de métodos decorados con @Transactional(),
   * por lo que espera recibir un EntityManager transaccional como argumento.
   * Si ocurre un error, la transacción será revertida por el método superior.
   *
   * @param email Email del usuario destinatario
   * @param manager EntityManager transaccional (proporcionado por el decorador)
   * @returns La notificación creada
   */
  async sendWelcome(email: string, manager: EntityManager) {
    try {
      if (email.includes('fail')) {
        throw new Error('Simulated failure');
      }

      const user = await manager.findOneBy(User, { email });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con el email: ${email}`,
        );
      }

      const notificacion = new UserNotification();
      notificacion.mensaje = `Bienvenido ${email}`;
      notificacion.destinatario = email;
      notificacion.user = user;

      return await manager.save(UserNotification, notificacion);
    } catch (error) {
      // Puedes hacer logging aquí si quieres
      console.error(
        `Error al enviar notificación de bienvenida a ${email}:`,
        error,
      );

      // Relanza una excepción adecuada para que el controlador o transacción maneje
      throw new InternalServerErrorException(
        'No se pudo enviar la notificación de bienvenida',
      );
    }
  }

  /**
   * Envía una notificación cuando se crea una orden.
   *
   * Este método está diseñado para ser usado dentro de métodos decorados con @Transactional(),
   * por lo que espera recibir un EntityManager transaccional como argumento.
   * Si ocurre un error, la transacción será revertida por el método superior.
   *
   * @param user Usuario destinatario
   * @param order Orden creada
   * @param manager EntityManager transaccional (proporcionado por el decorador)
   * @returns La notificación creada
   */
  async sendOrderCreated(user: User, order: Order, manager: EntityManager) {
    if (order.total > 10000) {
      throw new Error('Total demasiado alto para notificación de prueba');
    }

    const notification = new UserNotification();
    notification.user = user;
    notification.mensaje = `Tu orden #${order.id} ha sido creada`;
    notification.destinatario = user.email;

    return await manager.save(UserNotification, notification);
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
