import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadController } from './upload/upload.controller';
import { IndexerController } from './indexer/indexer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Holder } from './indexer/holder.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo/mongo.service';
import { MongoController } from './mongo/mongo.controller';

console.log(process.env.MONGO_URI);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Holder],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Holder]),
    MongooseModule.forRoot(process.env.MONGO_URI || '', {
      authSource: 'admin',
    }),
  ],
  controllers: [
    AppController,
    UploadController,
    IndexerController,
    MongoController,
  ],
  providers: [AppService, MongoService],
})
export class AppModule {}
