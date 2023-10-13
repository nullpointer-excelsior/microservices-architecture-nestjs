import { Module } from '@nestjs/common';
import { SpotifyMonolithController } from './spotify-monolith.controller';
import { SpotifyMonolithService } from './spotify-monolith.service';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PersistenceModule.register({
      host: process.env.SPOTIFY_MONOLITH_DATABASE_HOST,
      port: +process.env.SPOTIFY_MONOLITH_DATABASE_PORT,
      username: process.env.SPOTIFY_MONOLITH_DATABASE_USER,
      password: process.env.SPOTIFY_MONOLITH_DATABASE_PASS,
      database: process.env.SPOTIFY_MONOLITH_DATABASE_NAME,
    })
  ],
  controllers: [SpotifyMonolithController],
  providers: [SpotifyMonolithService],
})
export class SpotifyMonolithModule {}
