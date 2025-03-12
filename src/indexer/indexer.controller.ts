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
import { Between, In, Not, Repository } from 'typeorm';
import { Holder } from './holder.entity';

interface FiltersSVLs {
  numOwners: string;
  numMaintenances: string;
  numDefects: string;
  numModifications: string;
  defects: {
    cosmetic: [boolean, string, string];
    minor: [boolean, string, string];
    moderate: [boolean, string, string];
    important: [boolean, string, string];
    critical: [boolean, string, string];
  };
  numRepairs: string;
  vin: string;
  brand: string;
  model: string;
  year: string;
  kilometers: string[];
  state: string[];
  weight: string[];
  power: string[];
  shift: string[];
  fuel: string[];
  autonomy: string[];
  climate: string[];
  usage: string[];
  storage: string[];
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
    const where: any = {};
    where.owner_address = Not(owner_address);
    where.requester_address = Not(owner_address);
    where.num_owners = Between(
      filters.numOwners[0] == '' ? 0 : parseInt(filters.numOwners[0]),
      filters.numOwners[1] == '' ? 9999 : parseInt(filters.numOwners[1]),
    );
    where.num_maintenances = Between(
      filters.numMaintenances[0] == ''
        ? 0
        : parseInt(filters.numMaintenances[0]),
      filters.numMaintenances[1] == ''
        ? 9999
        : parseInt(filters.numMaintenances[1]),
    );
    where.num_modifications = Between(
      filters.numModifications[0] == ''
        ? 0
        : parseInt(filters.numModifications[0]),
      filters.numModifications[1] == ''
        ? 99999
        : parseInt(filters.numModifications[1]),
    );

    if (filters.defects.cosmetic[0] == true) {
      where.num_cosmetic_defects = Between(
        filters.defects.cosmetic[1],
        filters.defects.cosmetic[2],
      );
    }
    if (filters.defects.minor[0] == true) {
      where.num_minor_defects = Between(
        filters.defects.minor[1],
        filters.defects.minor[2],
      );
    }
    if (filters.defects.moderate[0] == true) {
      where.num_moderate_defects = Between(
        filters.defects.moderate[1],
        filters.defects.moderate[2],
      );
    }
    if (filters.defects.important[0] == true) {
      where.num_important_defects = Between(
        filters.defects.important[1],
        filters.defects.important[2],
      );
    }
    if (filters.defects.critical[0] == true) {
      where.num_critical_defects = Between(
        filters.defects.critical[1],
        filters.defects.critical[2],
      );
    }

    where.num_repairs = Between(
      filters.numRepairs[0] == '' ? 0 : parseInt(filters.numRepairs[0]),
      filters.numRepairs[1] == '' ? 9999 : parseInt(filters.numRepairs[1]),
    );
    if (filters.vin != '') where.vin = filters.vin;
    if (filters.brand != '' && filters.brand != 'Dashboard.Placeholders.brand')
      where.brand = filters.brand;
    if (filters.model != '' && filters.model != 'Dashboard.Placeholders.model')
      where.brand = filters.brand;
    where.year = Between(
      filters.year[0] == '' ? 0 : parseInt(filters.year[0]),
      filters.year[1] == '' ? 9999 : parseInt(filters.year[1]),
    );

    let kmFrom = 0;
    if (filters.kilometers[0] != '' && filters.kilometers[2] == 'mi')
      kmFrom = Math.round(parseFloat(filters.kilometers[0]) * 0.621371);
    else if (filters.kilometers[0] != '')
      kmFrom = parseInt(filters.kilometers[0]);
    let kmTo = 99999999;
    if (filters.kilometers[1] != '' && filters.kilometers[2] == 'mi')
      kmTo = Math.round(parseFloat(filters.kilometers[1]) * 0.621371);
    else if (filters.kilometers[1] != '')
      kmFrom = parseInt(filters.kilometers[1]);
    where.kilometers = Between(kmFrom, kmTo);

    let state = filters.state;
    if (filters.state[0] == 'Dashboard.Placeholders.state') state[0] = '';
    state = state.filter((str) => str !== '');
    if (state.length > 0) where.state = In(state);

    let weightFrom = 0;
    if (filters.weight[0] != '' && filters.weight[2] == 'kW')
      weightFrom = Math.round(parseFloat(filters.weight[0]) * 2.20462);
    else if (filters.weight[0] != '') weightFrom = parseInt(filters.weight[0]);
    let weightTo = 9999999;
    if (filters.weight[1] != '' && filters.weight[2] == 'kW')
      weightTo = Math.round(parseFloat(filters.weight[1]) * 2.20462);
    else if (filters.weight[1] != '') weightTo = parseInt(filters.weight[1]);
    where.weight = Between(weightFrom, weightTo);

    let powerFrom = 0;
    if (filters.power[0] != '' && filters.power[2] == 'kW')
      powerFrom = Math.round(parseFloat(filters.power[0]) * 1.34102);
    else if (filters.power[0] != '') powerFrom = parseInt(filters.power[0]);
    let powerTo = 9999;
    if (filters.power[1] != '' && filters.power[2] == 'kW')
      powerTo = Math.round(parseFloat(filters.power[1]) * 1.34102);
    else if (filters.power[1] != '') powerTo = parseInt(filters.power[1]);
    where.power = Between(powerFrom, powerTo);

    let shift = filters.shift;
    if (filters.shift[0] == 'Dashboard.Placeholders.shift') shift[0] = '';
    shift = shift.filter((str) => str !== '');
    if (shift.length > 0) where.shift = In(shift);

    let fuel = filters.fuel;
    if (filters.fuel[0] == 'Dashboard.Placeholders.fuel') fuel[0] = '';
    fuel = fuel.filter((str) => str !== '');
    if (fuel.length > 0) where.fuel = In(fuel);

    let autonomyFrom = 0;
    if (filters.autonomy[0] != '' && filters.autonomy[2] == 'mi')
      autonomyFrom = Math.round(parseFloat(filters.autonomy[0]) * 0.621371);
    else if (filters.autonomy[0] != '')
      autonomyFrom = parseInt(filters.autonomy[0]);
    let autonomyTo = 9999999;
    if (filters.autonomy[1] != '' && filters.autonomy[2] == 'mi')
      autonomyTo = Math.round(parseFloat(filters.autonomy[1]) * 0.621371);
    else if (filters.autonomy[1] != '')
      autonomyTo = parseInt(filters.autonomy[1]);
    where.autonomy = Between(autonomyFrom, autonomyTo);

    let climate = filters.climate;
    if (filters.climate[0] == 'Dashboard.Placeholders.climate') climate[0] = '';
    climate = climate.filter((str) => str !== '');
    if (climate.length > 0) where.climate = In(climate);

    let usage = filters.usage;
    if (filters.usage[0] == 'Dashboard.Placeholders.usage') usage[0] = '';
    usage = usage.filter((str) => str !== '');
    if (usage.length > 0) where.usage = In(usage);

    let storage = filters.storage;
    if (filters.storage[0] == 'Dashboard.Placeholders.storage') storage[0] = '';
    storage = storage.filter((str) => str !== '');
    if (storage.length > 0) where.storage = In(storage);

    console.log(where);
    const holder = await this.holderRepository.find({
      skip: this.GROUP_SIZE * parseInt(page),
      take: this.GROUP_SIZE,
      where,
    });
    console.log(holder);
    const totalHolders = await this.holderRepository.find({ where });
    if (holder.length == 0) {
      throw new NotFoundException(
        `Holder with filters ${JSON.stringify(filters)} not found`,
      );
    }
    return [holder, totalHolders.length];
  }
}
