import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  @Get('holder/:id')
  async getHolderById(@Param('id') id: string) {
    const holder = await this.holderRepository.find({ where: { id } });
    if (holder.length == 0) {
      throw new NotFoundException(`Holder with ID ${id} not found`);
    }
    return holder;
  }

  @Get('holder/vin/:vin')
  async getHolderByVIN(@Param('vin') vin: string) {
    const holder = await this.holderRepository.find({ where: { vin } });
    if (holder.length == 0) {
      throw new NotFoundException(`Holder with VIN ${vin} not found`);
    }
    return holder;
  }
}
