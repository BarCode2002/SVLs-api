import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Holder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vin: string;

  @Column()
  address: string;
}
