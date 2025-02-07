import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadController } from './upload/upload.controller';
import { IndexerController } from './indexer/indexer.controller';

@Module({
  imports: [],
  controllers: [AppController, UploadController, IndexerController],
  providers: [AppService],
})
export class AppModule {}
