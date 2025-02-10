import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Holder } from './holder.entity';

@Controller('indexer')
export class IndexerController {
  constructor(
    @InjectRepository(Holder)
    private readonly holderRepository: Repository<Holder>,
  ) {}

  @Get('holders')
  async getHolders() {
    return await this.holderRepository.find();
  }

  @Get('holder/pk/:svl_pk')
  async getHolderById(@Param('svl_pk') svl_key: string) {
    const holder = await this.holderRepository.find({ where: { svl_key } });
    if (holder.length == 0) {
      throw new NotFoundException(
        `Holder with primary key ${svl_key} not found`,
      );
    }
    return holder;
  }

  @Get('holder/owner_address/:owner_address')
  async getHolderByOwner(@Param('owner_address') owner_address: string) {
    const holder = await this.holderRepository.find({
      where: { owner_address },
    });
    if (holder.length == 0) {
      throw new NotFoundException(
        `Holder with owner address ${owner_address} not found`,
      );
    }
    return holder;
  }

  @Get('holder/by_vin')
  async getHolderByVIN(
    @Query('vin') vin: string,
    @Query('owner_address') owner_address: string,
  ) {
    const holder = await this.holderRepository.find({
      where: {
        vin: vin,
        owner_address: Not(owner_address),
      },
    });
    if (holder.length == 0) {
      throw new NotFoundException(`Holder with VIN ${vin} not found`);
    }
    return holder;
  }
}
