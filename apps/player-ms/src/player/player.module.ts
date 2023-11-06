import { Module } from '@nestjs/common';
import { PlayListUseCases } from './application/playlists.use-cases';
import { PlaylistService } from './domain/service/playlist.service';
import { SongService } from './domain/service/song.service';
import { UserService } from './domain/service/user.service';
import { PlaylistController } from './infrastructure/restful-api/controller/playlist.controller';
import { RadioController } from './infrastructure/restful-api/controller/radio.controller';
import { RadioUseCases } from './application/radio.use-cases';
import { RadioService } from './domain/service/radio.service';
import { NewSongController } from './infrastructure/rabbitmq/new-song.consumer';

@Module({
    providers:[
        PlayListUseCases,
        RadioUseCases,
        UserService,
        PlaylistService,
        SongService,
        RadioService
    ],
    controllers: [
        PlaylistController,
        RadioController,
        NewSongController
    ],
})
export class PlayerModule {}
