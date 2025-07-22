import { Order } from 'src/modules/order/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('orden-item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
