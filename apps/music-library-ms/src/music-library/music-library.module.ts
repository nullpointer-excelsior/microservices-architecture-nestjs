import { Module } from '@nestjs/common';
import { AlbumController } from './controller/album.controller';
import { ArtistController } from './controller/artists.controller';
import { GenreController } from './controller/genre.controller';
import { SongController } from './controller/song.controller';
import { AlbumService } from './service/album.service';
import { ArtistService } from './service/artist.service';
import { GenreService } from './service/genre.service';
import { SongService } from './service/song.service';
import { RabbitmqQueueModule } from '../../../../libs/rabbitmq-queue/rabbitmq-queue.module';
import { RadioController } from './controller/radio.controller';
import { RadioService } from './service/radio.service';

@Module({
    controllers: [
        ArtistController,
        AlbumController,
        GenreController,
        SongController,
        RadioController
    ],
    providers: [
        AlbumService,
        ArtistService,
        GenreService,
        SongService,
        RadioService
    ],
    imports: [
        RabbitmqQueueModule,
    ]
})
export class MusicLibraryModule {}
