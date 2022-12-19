import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customerEntity';
import { OrderPart } from './orderPartEntity';

@Entity()
export class Order {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, default: new Date() })
  createdAt: Date;

  @ApiProperty({ type: () => Customer })
  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Promise<Customer>;

  @ApiProperty()
  @OneToMany(() => OrderPart, (orderPart) => orderPart.order)
  orderParts!: OrderPart[];
}
