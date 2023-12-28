import { Module } from '@nestjs/common';
import { MediaModule } from './media/media.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    MediaModule,
    S3Module
  ]
})
export class MediaMsModule {}
