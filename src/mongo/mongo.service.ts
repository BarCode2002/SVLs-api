import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

interface Translation {
  language: string;
}

interface List {
  type: string;
}

interface SmartContract {
  field: string;
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

  async findByType(type: string): Promise<List | null> {
    if (!this.connection.db) {
      throw new Error('Database connection is not available');
    }
    const translationsCollection = this.connection.db.collection<List>('lists');
    const result = await translationsCollection.findOne({ type });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (result) return result[type];
    else return result;
  }

  async findSmartContractField(): Promise<SmartContract | null> {
    if (!this.connection.db) {
      throw new Error('Database connection is not available');
    }
    const smartContractCollection =
      this.connection.db.collection<SmartContract>('smartContract');
    const result = await smartContractCollection.findOne();
    return result;
  }
}
