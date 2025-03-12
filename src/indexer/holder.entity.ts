import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Holder {
  @PrimaryGeneratedColumn()
  svl_key: string;

  @Column()
  owner_address: string;

  @Column()
  first_owner: boolean;

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
  year: number;

  @Column()
  kilometers: number;

  @Column()
  state: string;

  @Column()
  weight: number;

  @Column()
  power: number;

  @Column()
  shift: string;

  @Column()
  fuel: string;

  @Column()
  autonomy: number;

  @Column()
  climate: string;

  @Column()
  usage: string;

  @Column()
  storage: string;

  @Column()
  num_owners: number;

  @Column()
  num_maintenances: number;

  @Column()
  num_modifications: number;

  @Column()
  num_cosmetic_defects: number;

  @Column()
  num_minor_defects: number;

  @Column()
  num_moderate_defects: number;

  @Column()
  num_important_defects: number;

  @Column()
  num_critical_defects: number;

  @Column()
  num_repairs: number;
}
