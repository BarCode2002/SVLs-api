import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadController } from './upload/upload.controller';
import { IndexerController } from './indexer/indexer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holder } from './indexer/holder.entity';

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
  ],
  controllers: [AppController, UploadController, IndexerController],
  providers: [AppService],
})
export class AppModule {}
