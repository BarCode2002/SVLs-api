import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Holder {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  vin: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  request: string;

  @Column()
  accept_request: string;

  @Column()
  prev_owners_info: string;

  @Column()
  curr_owner_info: string;

  @Column()
  price: string;
}
