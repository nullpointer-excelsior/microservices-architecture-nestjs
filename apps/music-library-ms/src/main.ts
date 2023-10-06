import { NestFactory } from '@nestjs/core';
import { MusicLibraryMsModule } from './music-library-ms.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SongRepository } from './infrastructure/persistence/song.repository';
import { SongEntity } from './infrastructure/persistence/song.entity';
import * as crypto from 'crypto';

async function bootstrap() {

  const app = await NestFactory.create(MusicLibraryMsModule);

  const config = new DocumentBuilder()
    .setTitle('Music library microservice')
    .setDescription('The Music library API description')
    .setVersion('1.0')
    .addTag('Player-library')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const songRepository = app.get(SongRepository)
  songRepository.save(songFactory({
    name: "angel of death",
  }))
  songRepository.save(songFactory({
    name: "raining blood"
  }))
  songRepository.save(songFactory({
    name: "show no mercy",
    album: "show no mercy"
  }))
  songRepository.save(songFactory({
    name: "separate ways",
    album: "frontiers",
    artist: "journey",
    genre: "rock"
  }))

  await app.listen(3000);

}
bootstrap();

function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex');
}

function songFactory({ 
  artist = "slayer", 
  genre= "metal",
  album="raining blood",
  name,
  trackUrl="slayer.com/1"
  
}: Partial<{ id: string, artist: string, genre: string, album: string, name: string, trackUrl: string }>) {
  const s = new SongEntity()
  s.id = generateUUID()
  s.name = name
  s.artist = artist
  s.album = album
  s.genre = genre
  s.trackUrl = trackUrl
  return s
}