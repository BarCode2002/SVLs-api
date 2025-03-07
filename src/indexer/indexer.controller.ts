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
  numModifications: string;
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
    where.owner_address = Not(owner_address);
    where.num_owners = Between(
      filters.numOwners[0] == '' ? '0' : filters.numOwners[0],
      filters.numOwners[1] == '' ? '9999' : filters.numOwners[1],
    );
    where.num_maintenances = Between(
      filters.numMaintenances[0] == '' ? '0' : filters.numMaintenances[0],
      filters.numMaintenances[1] == '' ? '9999' : filters.numMaintenances[1],
    );
    where.num_modifications = Between(
      filters.numModifications[0] == '' ? '0' : filters.numModifications[0],
      filters.numModifications[1] == '' ? '9999' : filters.numModifications[1],
    );
    where.num_repairs = Between(
      filters.numRepairs[0] == '' ? '0' : filters.numRepairs[0],
      filters.numRepairs[1] == '' ? '9999' : filters.numRepairs[1],
    );
    where.vin = filters.vin;
    where.brand =
      filters.brand == 'Dashboard.Placeholders.brand' ? '' : filters.brand;
    where.model =
      filters.model == 'Dashboard.Placeholders.model' ? '' : filters.model;
    where.year = Between(
      filters.year[0] == '' ? '0' : filters.year[0],
      filters.year[1] == '' ? '9999' : filters.year[1],
    );

    let kmFrom = '';
    if (filters.kilometers[0] != '' && filters.kilometers[2] == 'mi')
      kmFrom = Math.round(
        parseFloat(filters.kilometers[0]) * 0.621371,
      ).toString();
    else if (filters.kilometers[1] != '') kmFrom = '0';
    let kmTo = '';
    if (filters.kilometers[1] != '' && filters.kilometers[2] == 'mi')
      kmTo = Math.round(
        parseFloat(filters.kilometers[0]) * 0.621371,
      ).toString();
    else if (filters.kilometers[1] != '') kmTo = '99999999';
    where.kilometers = Between(
      filters.kilometers[0] == '' ? '0' : kmFrom,
      filters.kilometers[1] == '' ? '99999999' : kmTo,
    );

    //where.state =
      //filters.state == 'Dashboard.Placeholders.state' ? '' : filters.state;

    let powerFrom = '';
    if (filters.power[0] != '' && filters.power[2] == 'kW')
      powerFrom = Math.round(parseFloat(filters.power[0]) * 1.34102).toString();
    else if (filters.power[1] != '') powerFrom = '0';
    let powerTo = '';
    if (filters.power[1] != '' && filters.power[2] == 'kW')
      powerTo = Math.round(parseFloat(filters.power[0]) * 1.34102).toString();
    else if (filters.power[1] != '') powerTo = '9999';
    where.power = Between(
      filters.power[0] == '' ? '0' : powerFrom,
      filters.power[1] == '' ? '9999' : powerTo,
    );

    //where.shift =
      //filters.shift == 'Dashboard.Placeholders.shift' ? '' : filters.shift;
    //where.fuel =
      //filters.fuel == 'Dashboard.Placeholders.fuel' ? '' : filters.fuel;

    let autonomyFrom = '';
    if (filters.autonomy[0] != '' && filters.autonomy[2] == 'mi')
      autonomyFrom = Math.round(
        parseFloat(filters.autonomy[0]) * 0.621371,
      ).toString();
    else if (filters.autonomy[0] != '') autonomyFrom = '0';
    let autonomyTo = '';
    if (filters.autonomy[1] != '' && filters.autonomy[2] == 'mi')
      autonomyTo = Math.round(
        parseFloat(filters.autonomy[0]) * 0.621371,
      ).toString();
    else if (filters.autonomy[1] != '') autonomyFrom = '99999999';
    where.autonomy = Between(
      filters.autonomy[0] == '' ? '0' : autonomyFrom,
      filters.autonomy[1] == '' ? '9999999' : autonomyTo,
    );

    /*where.climate =
      filters.climate == 'Dashboard.Placeholders.climate'
        ? ''
        : filters.climate;
    where.usage =
      filters.usage == 'Dashboard.Placeholders.usage' ? '' : filters.usage;
    where.storage =
      filters.storage == 'Dashboard.Placeholders.storage'
        ? ''
        : filters.storage;*/
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
