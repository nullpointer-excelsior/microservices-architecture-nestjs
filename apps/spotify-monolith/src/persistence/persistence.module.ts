import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/Album';
import { Artist } from './entities/Artist';
import { Genre } from './entities/Genre';
import { Song } from './entities/Song';

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
          entities: [
            Song,
            Album,
            Artist,
            Genre,
            // Playlist,
            // Queue,
            // User
          ],
          synchronize: true,
          logging: ['query']
        }),        
      ],
      exports: [
        PersistenceModule
      ],
      providers: [
      ]
    }
  }
}
