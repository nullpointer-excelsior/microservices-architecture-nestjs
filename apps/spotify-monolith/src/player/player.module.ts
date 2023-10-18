import { Module } from '@nestjs/common';
import { PlayListUseCases } from './application/playlists.use-cases';
import { PlaylistRepository } from './domain/repository/playlist.repository';
import { SongRepository } from './domain/repository/song.repository';
import { UserRepository } from './domain/repository/user.repository';
import { PlaylistController } from './infrastructure/restful-api/controller/playlist.controller';

@Module({
    providers:[
        PlayListUseCases,
        UserRepository,
        PlaylistRepository,
        SongRepository
    ],
    controllers: [
        PlaylistController
    ]
})
export class PlayerModule {}
