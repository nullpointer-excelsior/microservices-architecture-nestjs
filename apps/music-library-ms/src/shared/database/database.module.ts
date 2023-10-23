import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Artist } from './entities/artist.entity';
import { Genre } from './entities/genre.entity';
import { Radio } from './entities/radio.entity';
import { Song } from './entities/song.entity';

type Options = {
  host: string
  port: number
  database: string
  username: string
  password: string
}

@Module({})
export class DatabaseModule {

  static register(options: Options): DynamicModule {
    const entities = [
      Song,
      Album,
      Artist,
      Genre,
      Radio,
    ]

    const repositoriesModule = TypeOrmModule.forFeature(entities)
  
    return {
      global: true,
      module: DatabaseModule,
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
        repositoriesModule    
      ],
      exports: [
        DatabaseModule,
        repositoriesModule
      ],
    }
  }
}
