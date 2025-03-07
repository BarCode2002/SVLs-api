import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Holder {
  @PrimaryGeneratedColumn()
  svl_key: string;

  @Column()
  owner_address: string;

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

  @Column()
  vin: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  kilometers: string;

  @Column()
  state: string;

  @Column()
  power: string;

  @Column()
  shift: string;

  @Column()
  fuel: string;

  @Column()
  autonomy: string;

  @Column()
  climate: string;

  @Column()
  usage: string;

  @Column()
  storage: string;

  @Column()
  num_owners: string;

  @Column()
  num_maintenances: string;

  @Column()
  num_modifications: string;

  @Column()
  num_repairs: string;
}
