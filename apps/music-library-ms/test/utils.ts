import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAlbumRequest } from '../src/music-library/dto/create-album.request';
import { CreateArtistRequest } from '../src/music-library/dto/create-artist.request';
import { CreateGenreRequest } from '../src/music-library/dto/create-genre.request';
import { CreateSongRequest } from '../src/music-library/dto/create-song.request';
import { Album } from '../src/shared/database/entities/album.entity';
import { Artist } from '../src/shared/database/entities/artist.entity';
import { Genre } from '../src/shared/database/entities/genre.entity';
import { Song } from '../src/shared/database/entities/song.entity';


export async function cleanDatabase(app: INestApplication) {
  const ds = app.get<DataSource>(DataSource)
  const query = `
      delete from public.song;
      delete from public.album;
      delete from public.artist;
      delete from public.genre;
  `
  await ds.manager.query(query)
}


export function createArtistEntity(app: INestApplication) {
  const repository = app.get<Repository<Artist>>(getRepositoryToken(Artist))
  return function createEntity({ name = "Journey", biography = "Amazing band", photo = "artist.jpg" }: Partial<CreateArtistRequest>) {
    return repository.save({
      name,
      biography,
      photo,
    })
  }
}

export function createAlbumEntity(app: INestApplication) {
  const repository = app.get<Repository<Album>>(getRepositoryToken(Album))
  return function createEntity({ title = "Generic album", year = 1990, photo = "album.jpg", artistId }: Partial<CreateAlbumRequest>) {
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
    title = "amazing song 1",
    duration = 230,
    plays = 0,
    video = "song.avi",
    storage = "song.mp3",
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
      storage,
      genre
    })
  }
}

export function createGenreEntity(app: INestApplication) {
  const repository = app.get<Repository<Genre>>(getRepositoryToken(Genre))
  return function createEntity({ name = "Rock" }: Partial<CreateGenreRequest>) {
    return repository.save({
      name,
    })
  }
}
