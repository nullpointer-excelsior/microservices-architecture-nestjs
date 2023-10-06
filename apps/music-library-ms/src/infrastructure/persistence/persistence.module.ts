import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongEntity } from './song.entity';
import { SongRepository } from './song.repository';

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
    const repositoriesModule = TypeOrmModule.forFeature([
      SongEntity
    ])
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
            SongEntity
          ],
          synchronize: true,
          logging: ['query']
        }),
        TypeOrmModule.forFeature([
          SongEntity
        ]),
        repositoriesModule
      ],
      exports: [
        repositoriesModule,
        PersistenceModule
      ],
      providers: [
        SongRepository
      ]
    }
  }
}
