import { ApiProperty } from '@nestjs/swagger';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './orderEntity';
import { Part } from './partEntity';

@Entity()
export class OrderPart {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @ManyToOne(() => Order, (order) => order.orderParts)
  order: Order;

  @ApiProperty()
  @ManyToOne(() => Part, (part) => part.orderParts)
  part: Part;
}
