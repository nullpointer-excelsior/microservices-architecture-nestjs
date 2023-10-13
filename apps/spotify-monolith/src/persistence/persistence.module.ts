import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/Album';
import { Artist } from './entities/Artist';
import { Genre } from './entities/Genre';
import { Song } from './entities/Song';
import { Playlist } from './entities/Playlist';
import { Radio } from './entities/Radio';
import { User } from './entities/User';
import { AlbumRepository } from './repositories/album.repository';
import { ArtistRepository } from './repositories/artist.repository';
import { GenreRepository } from './repositories/genre.repository';
import { PlaylistRepository } from './repositories/playlist.repository';
import { RadioRepository } from './repositories/radio.repository';
import { SongRepository } from './repositories/song.repository';
import { UserRepository } from './repositories/user.repository';

type Options = {
  host: string
  port: number
  database: string
  username: string
  password: string
}

@Module({})
export class PersistenceModule {

  static register(options: Options): DynamicModule {

    const entities = [
      Song,
      Album,
      Artist,
      Genre,
      Playlist,
      Radio,
      User
    ]
    const repositories = TypeOrmModule.forFeature(entities)
  
    return {
      module: PersistenceModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: options.host,
          port: options.port,
          username: options.username,
          password: options.password,
          database: options.database,
          entities: entities,
          synchronize: true,
          logging: ['query']
        }),    
        repositories    
      ],
      exports: [
        PersistenceModule
      ],
      providers: [
        AlbumRepository,
        ArtistRepository,
        GenreRepository,
        PlaylistRepository,
        RadioRepository,
        SongRepository,
        UserRepository
      ]
    }
  }
}
