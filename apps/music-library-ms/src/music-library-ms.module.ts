import { Module } from '@nestjs/common';
import { MusicLibraryModule } from './music-library/music-library.module';

@Module({
  imports: [
    MusicLibraryModule,
  ],
})
export class MusicLibraryMsModule { }
