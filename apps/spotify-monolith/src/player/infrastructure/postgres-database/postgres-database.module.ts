import { Module } from '@nestjs/common';
import { UserPostgresRepository } from './repository/user.postgres.repository';
import { PlaylistPostgresRepository } from './repository/playlist.postgres.repository';
import { SongPostgresRepository } from './repository/song.postgres.repository';

@Module({
    providers: [
        UserPostgresRepository,
        PlaylistPostgresRepository,
        SongPostgresRepository
    ],
    exports: [
        UserPostgresRepository,
        PlaylistPostgresRepository,
        SongPostgresRepository,
    ]
})
export class PostgresDatabaseModule {}
