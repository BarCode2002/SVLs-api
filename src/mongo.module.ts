import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI || '',
        authSource: 'admin',
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
