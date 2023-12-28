import { Module } from '@nestjs/common';
import { MusicCatalogModule } from './music-catalog/music-catalog.module';
import { MediaServerModule } from './media-server/media-server.module';

@Module({
  imports: [
    MusicCatalogModule,
    MediaServerModule
  ],
})
export class WebBffModule {}
