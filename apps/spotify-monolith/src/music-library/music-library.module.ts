import { Module } from '@nestjs/common';
import { AlbumService } from './service/album.service';
import { ArtistService } from './service/artist.service';
import { GenreService } from './service/genre.service';
import { SongService } from './service/song.service';
import { ArtistController } from './controller/artists.controller';
import { AlbumController } from './controller/album.controller';
import { GenreController } from './controller/genre.controller';
import { SongController } from './controller/song.controller';

@Module({
    controllers: [
        ArtistController,
        AlbumController,
        GenreController,
        SongController
    ],
    providers: [
        AlbumService,
        ArtistService,
        GenreService,
        SongService
    ]
})
export class MusicLibraryModule {}
