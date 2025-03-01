import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Holder } from './holder.entity';

interface FiltersSVLs {
  numOwners: string;
  numMaintenances: string;
  numDefects: string;
  defectChoosenLevel: string;
  numRepairs: string;
  vin: string;
  brand: string;
  model: string;
  year: string;
  kilometers: string;
  state: string;
  color: string;
  power: string;
  shift: string;
  fuel: string;
  autonomy: string;
  climate: string;
  usage: string;
  storage: string;
}

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

  @Get('holder/requested_svls')
  async getHolderByRequestedSVLs(
    @Query('requester_address') requester_address: string,
  ) {
    const holder = await this.holderRepository.find({
      where: {
        requester_address: requester_address,
        owner_address: Not(requester_address),
      },
    });
    if (holder.length == 0) {
      throw new NotFoundException(
        `Holder with requester address ${requester_address} not found`,
      );
    }
    return holder;
  }

  @Post('holder/filterSVL')
  // eslint-disable-next-line @typescript-eslint/require-await
  async getHolderByFilters(
    @Query('owner_address') owner_address: string,
    @Body() filters: FiltersSVLs,
  ) {
    console.log(owner_address);
    console.log(filters);
    /*const holder = await this.holderRepository.find({
      where: {
        vin: vin,
        owner_address: Not(owner_address),
      },
    });
    if (holder.length == 0) {
      throw new NotFoundException(`Holder with VIN ${vin} not found`);
    }
    return holder;*/
  }
}
