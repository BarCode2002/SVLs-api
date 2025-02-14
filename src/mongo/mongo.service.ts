import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

interface Translation {
  language: string;
}

@Injectable()
export class MongoService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async findByLanguage(language: string): Promise<Translation | null> {
    if (!this.connection.db) {
      throw new Error('Database connection is not available');
    }
    const translationsCollection =
      this.connection.db.collection<Translation>('translations');
    const result = await translationsCollection.findOne({ language });
    return result;
  }
}
