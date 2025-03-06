/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { Between, Not, Repository } from 'typeorm';
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
  private readonly GROUP_SIZE = 3;
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

  @Get('holder/my_svls')
  async getHolderByOwner(
    @Query('owner_address') owner_address: string,
    @Query('page') page: string,
  ) {
    const holder = await this.holderRepository.find({
      skip: this.GROUP_SIZE * parseInt(page),
      take: this.GROUP_SIZE,
      where: { owner_address },
    });
    const totalHolders = await this.holderRepository.find({
      where: { owner_address },
    });
    if (holder.length == 0) {
      throw new NotFoundException(
        `Holder with owner address ${owner_address} not found`,
      );
    }
    return [holder, totalHolders.length];
  }

  @Get('holder/requested_svls')
  async getHolderByRequestedSVLs(
    @Query('requester_address') requester_address: string,
    @Query('page') page: string,
  ) {
    const holder = await this.holderRepository.find({
      skip: this.GROUP_SIZE * parseInt(page),
      take: this.GROUP_SIZE,
      where: {
        requester_address: requester_address,
        owner_address: Not(requester_address),
      },
    });
    const totalHolders = await this.holderRepository.find({
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
    return [holder, totalHolders.length];
  }

  @Post('holder/filterSVL')
  async getHolderByFilters(
    @Query('owner_address') owner_address: string,
    @Query('page') page: string,
    @Body() filters: FiltersSVLs,
  ) {
    console.log(filters);
    let where: any = {};
    where.owner_address = owner_address;
    if (filters.vin != '') where.vin = filters.vin;
    where.brand =
      filters.brand == 'Dashboard.Placeholders.brand' ? '' : filters.brand;
    where.model =
      filters.model == 'Dashboard.Placeholders.model' ? '' : filters.model;
    where.year = Between(
      filters.year[0] == '' ? '0' : filters.year[0],
      filters.year[1] == '' ? '9999' : filters.year[1],
    );
    where = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.entries(where).filter(([, value]) => value !== ''),
    );

    console.log(where);
    const holder = await this.holderRepository.find({
      skip: this.GROUP_SIZE * parseInt(page),
      take: this.GROUP_SIZE,
      where,
    });
    const totalHolders = await this.holderRepository.find({ where });
    if (holder.length == 0) {
      throw new NotFoundException(
        `Holder with filters ${JSON.stringify(filters)} not found`,
      );
    }
    return [holder, totalHolders.length];
  }
}
