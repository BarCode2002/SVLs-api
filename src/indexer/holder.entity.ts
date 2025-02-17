import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Holder {
  @PrimaryGeneratedColumn()
  svl_key: string;

  @Column()
  owner_address: string;

  @Column()
  vin: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  requester_address: string;

  @Column()
  request_accepted: string;

  @Column()
  current_owner_info: string;

  @Column()
  previous_owners_info: string;

  @Column()
  svl_price: string;
}
