import { ApiProperty } from '@nestjs/swagger';
import { Column, OneToMany, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { OrderPart } from './orderPartEntity';

@Entity()
export class Part {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  quantityOnHand: number;

  @ApiProperty()
  @OneToMany(() => OrderPart, (orderPart) => orderPart.part)
  orderParts!: OrderPart[];
}
