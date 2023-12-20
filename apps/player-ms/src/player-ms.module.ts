import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    PlayerModule,
    S3Module
  ]
})
export class PlayerMsModule {}
