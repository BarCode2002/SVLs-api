import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadController } from './upload/upload.controller';
import { IndexerController } from './indexer/indexer.controller';
import { ConfigModule } from '@nestjs/config';
import { MongoService } from './mongo/mongo.service';
import { MongoController } from './mongo/mongo.controller';
import { PostgresModule } from './postgres.module';
import { MongoModule } from './mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    MongoModule,
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
