import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

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
      User
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
