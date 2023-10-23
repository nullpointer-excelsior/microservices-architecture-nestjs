import { Module } from '@nestjs/common';
import { MusicLibraryModule } from './music-library/music-library.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    MusicLibraryModule,
  ],
})
export class MusicLibraryMsModule {}
