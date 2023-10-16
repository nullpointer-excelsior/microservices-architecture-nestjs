import { Module } from '@nestjs/common';
import { MusicLibraryModule } from './music-library/music-library.module';
import { SharedModule } from './shared/shared.module';
import { AccountsModule } from './accounts/accounts.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    SharedModule,
    MusicLibraryModule,
    AccountsModule,
    PlayerModule
  ],
  
})
export class SpotifyMonolithModule { }
