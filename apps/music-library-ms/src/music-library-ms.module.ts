import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongEntity } from './infrastructure/persistence/song.entity';
import { SongController } from './infrastructure/api/song.controller';
import { SongUseCases } from './application/song.use-cases';
import { SongRepository } from './infrastructure/persistence/song.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'music-library',
      password: 'music-library',
      database: 'music-library',
      entities: [SongEntity],
      synchronize: true,
      logging: ['query']
    }),
    TypeOrmModule.forFeature([SongEntity])
  ],
  controllers: [
    SongController
  ],
  providers: [
    SongUseCases,
    SongRepository
  ]
})
export class MusicLibraryMsModule {}
