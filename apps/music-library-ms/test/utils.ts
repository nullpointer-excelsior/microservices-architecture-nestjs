import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { MusicLibraryModule } from '../src/music-library/music-library.module';
import * as fs from 'fs';
import { CreateArtistRequest } from '../src/music-library/dto/create-artist.request';
import { CreateAlbumRequest } from '../src/music-library/dto/create-album.request';
import { ArtistModel } from '../src/music-library/model/artist.model';
import { AlbumModel } from '../src/music-library/model/album.model';
import { CreateSongRequest } from '../src/music-library/dto/create-song.request';
import { CreateGenreRequest } from '../src/music-library/dto/create-genre.request';
import { GenreModel } from '../src/music-library/model/genre.model';
import { RabbitmqClient } from '../../../libs/rabbitmq-queue/src/rabbitmq-queue/services/rabbitmq-client.service';
import { Song } from '../src/shared/database/entities/song.entity';
import { Genre } from '../src/shared/database/entities/genre.entity';
import { Artist } from '../src/shared/database/entities/artist.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Album } from '../src/shared/database/entities/album.entity';



export async function loadDatabaseData(app: INestApplication) {
    const data = fs.readFileSync('apps/music-library-ms/test/infrastructure/data.sql', 'utf8');
    await app.get<DataSource>(DataSource).manager.connection.query(data)
}

export async function getDatasource(app: INestApplication) {
  return app.get<DataSource>(DataSource)
}

export async function cleanDatabase(ds) {
  const query = `
      delete from public.song_radios_radio;
      delete from public.song;
      delete from public.album;
      delete from public.artist;
      delete from public.radio;
      delete from public.genre;
  `
  await ds.manager.query(query)
}

export function createArtist(app: INestApplication, artistData: CreateArtistRequest) {
  return request(app.getHttpServer())
    .post('/artists')
    .send(artistData)
    .expect(HttpStatus.CREATED);
}

export function createAlbum(app: INestApplication, data: CreateAlbumRequest) {
  return request(app.getHttpServer())
    .post('/albums')
    .send(data)
    .expect(HttpStatus.CREATED);
}

export function createSong(app: INestApplication, data: CreateSongRequest) {
  return request(app.getHttpServer())
    .post('/songs')
    .send(data)
    .expect(HttpStatus.CREATED);
}

export function createGenre(app: INestApplication, data: CreateGenreRequest) {
  return request(app.getHttpServer())
    .post('/genres')
    .send(data)
    .expect(HttpStatus.CREATED);
}

export function createArtistEntity(app: INestApplication) {
  const repository = app.get<Repository<Artist>>(getRepositoryToken(Artist))
  return function createEntity({ name="Journey", biography="Amazing band", photo="artist.jpg" }: Partial<CreateArtistRequest>) {
    return repository.save({
      name,
      biography,
      photo,
    })
  }
}

export function createAlbumEntity(app: INestApplication) {
  const repository = app.get<Repository<Album>>(getRepositoryToken(Album))
  return function createEntity({ title="Generic album", year=1990, photo="album.jpg", artistId }: Partial<CreateAlbumRequest>) {
    const artist = new Artist()
    artist.id = artistId
    return repository.save({
      title,
      year,
      photo,
      artist
    })
  }
}

export function createSongEntity(app: INestApplication) {
  const repository = app.get<Repository<Song>>(getRepositoryToken(Song))
  
  return function createEntity({ 
    title="amazing song 1", 
    duration=230,
    plays=0,
    video="song.avi",
    albumId, 
    artistId, 
    genreId
  }: Partial<CreateSongRequest>) {
    const artist = new Artist()
    artist.id = artistId
    const album = new Album()
    album.id = albumId
    const genre = new Genre()
    genre.id = genreId
    return repository.save({
      title,
      duration,
      plays,
      video,
      album,
      artist,
      genre
    })
  }
}

export function createGenreEntity(app: INestApplication) {
  const repository = app.get<Repository<Genre>>(getRepositoryToken(Genre))
  return function createEntity({ name="Rock" }: Partial<CreateGenreRequest>) {
    return repository.save({
      name,
    })
  }
}
