import { Module } from '@nestjs/common';
import { MusicLibraryApiModule } from '../../../libs/music-library-api/src';
import { RadioModule } from './radio/radio.module';

@Module({
  imports: [
    MusicLibraryApiModule,
    RadioModule,
  ],
  
})
export class MusicDiscoveryMsModule {}
