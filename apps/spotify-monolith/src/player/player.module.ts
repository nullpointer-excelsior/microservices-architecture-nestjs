import { Module } from '@nestjs/common';
import { PostgresDatabaseModule } from './infrastructure/postgres-database/postgres-database.module';
import { PlayListUseCases } from './application/playlists.use-cases';
import { UserPostgresRepository } from './infrastructure/postgres-database/repository/user.postgres.repository';
import { PlaylistPostgresRepository } from './infrastructure/postgres-database/repository/playlist.postgres.repository';
import { SongPostgresRepository } from './infrastructure/postgres-database/repository/song.postgres.repository';
import { PLAYLIST_REPOSITORY, SONG_REPOSITORY, USER_REPOSITORY } from './providers.token';

@Module({
    imports: [
        PostgresDatabaseModule
    ],
    providers:[
        {
            provide: USER_REPOSITORY,
            useExisting: UserPostgresRepository
        },
        {
            provide: PLAYLIST_REPOSITORY,
            useExisting: PlaylistPostgresRepository
        },
        {
            provide: SONG_REPOSITORY,
            useExisting: SongPostgresRepository
        },
        PlayListUseCases,
        
    ]
})
export class PlayerModule {}
