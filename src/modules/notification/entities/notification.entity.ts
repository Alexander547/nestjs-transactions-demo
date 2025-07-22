import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notification')
export class UserNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  destinatario: string;

  @Column()
  mensaje: string;

  @CreateDateColumn({ nullable: true })
  fechaEnvio: Date;

  @ManyToOne(() => User, (user) => user.notificaciones, { onDelete: 'CASCADE' })
  user: User;
}
