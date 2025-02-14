import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadController } from './upload/upload.controller';
import { IndexerController } from './indexer/indexer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holder } from './indexer/holder.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo/mongo.service';
import { MongoController } from './mongo/mongo.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dipdup',
      password: 'pepe11',
      database: 'dipdup',
      entities: [Holder],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Holder]),
    MongooseModule.forRoot(
      'mongodb://user:pepe@localhost:27017/translationsDB',
      {
        authSource: 'admin',
      },
    ),
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
