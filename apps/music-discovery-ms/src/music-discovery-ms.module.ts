import { Module } from '@nestjs/common';
import { MusicLibraryApiModule } from '../../../libs/music-library-api/src';
import { RadioModule } from './radio/radio.module';
import { PlaylistsModule } from './playlist-catalog/playlists.module';
import { SharedModule } from './shared/shared.module';
import { UserCatalogModule } from './user-catalog/user-catalog.module';

@Module({
  imports: [
    MusicLibraryApiModule,
    RadioModule,
    PlaylistsModule,
    SharedModule,
    UserCatalogModule,
  ],
  
})
export class MusicDiscoveryMsModule {}
