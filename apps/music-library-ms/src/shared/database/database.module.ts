import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Artist } from './entities/artist.entity';
import { Genre } from './entities/genre.entity';
import { Song } from './entities/song.entity';

type Options = {
  host: string
  port: number
  database: string
  username: string
  password: string
}

type AsyncOptions = {
  useFactory(...args: any[]): Options
  inject: any[],
  imports: any[]
}

@Module({})
export class DatabaseModule {

  static forRoot(options: Options): DynamicModule {
    const entities = [
      Song,
      Album,
      Artist,
      Genre,
    ]
    
    const repositoriesModule = TypeOrmModule.forFeature(entities)
  
    return {
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

  static forRootAsync(options: AsyncOptions): DynamicModule {
    
    const entities = [
      Song,
      Album,
      Artist,
      Genre,
    ]

    const repositoriesModule = TypeOrmModule.forFeature(entities)
  
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (...args: any[]) => {
            const config = options.useFactory(...args)
            return {
              type: 'postgres',
              host: config.host,
              port: config.port,
              username: config.username,
              password: config.password,
              database: config.database,
              entities: entities,
              synchronize: true,
              logging: ['query']
            }
          },
          inject: options.inject || [],
          imports: options.imports || []
        }),
        repositoriesModule    
      ],
      exports: [
        repositoriesModule
      ],
    }
  }
}
