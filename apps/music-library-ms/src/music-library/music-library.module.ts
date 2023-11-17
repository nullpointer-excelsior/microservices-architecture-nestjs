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
import { DatabaseModule } from '../shared/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    controllers: [
        ArtistController,
        AlbumController,
        GenreController,
        SongController,
    ],
    providers: [
        AlbumService,
        ArtistService,
        GenreService,
        SongService,
    ],
    imports: [
        RabbitmqQueueModule,
        DatabaseModule.forRootAsync({
            useFactory(config: ConfigService) {
                return {
                    host: config.get('MUSIC_LIBRARY_MS_DATABASE_HOST'),
                    port: +config.get('MUSIC_LIBRARY_MS_DATABASE_PORT'),
                    username: config.get('MUSIC_LIBRARY_MS_DATABASE_USER'),
                    password: config.get('MUSIC_LIBRARY_MS_DATABASE_PASS'),
                    database: config.get('MUSIC_LIBRARY_MS_DATABASE_NAME'),
                }
            },
            inject: [
                ConfigService
            ],
            imports: [
                ConfigModule
            ]
        })
    ]
})
export class MusicLibraryModule {}
