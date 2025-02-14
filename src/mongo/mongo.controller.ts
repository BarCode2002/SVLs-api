import { Controller, Get, Query } from '@nestjs/common';
import { MongoService } from './mongo.service';

interface Translation {
  language: string;
}

@Controller('mongo')
export class MongoController {
  constructor(private readonly mongoService: MongoService) {}

  @Get('translations')
  async getTranslationsByLanguage(
    @Query('language') language: string,
  ): Promise<Translation | null> {
    return this.mongoService.findByLanguage(language);
  }
}
