import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { RabbitmqClient } from '../../../libs/rabbitmq-queue/src/rabbitmq-queue/services/rabbitmq-client.service';
import { CreateSongRequest } from '../src/music-library/dto/create-song.request';
import { MusicLibraryModule } from '../src/music-library/music-library.module';
import { cleanDatabase, createAlbumEntity, createArtistEntity, createGenreEntity, createSongEntity, getDatasource } from './utils';


describe('Songs (e2e)', () => {

  let app: INestApplication;
  let datasource: DataSource;
  const rabbitMqEmitToMock = jest.fn()

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MusicLibraryModule
      ]
    })
      .overrideProvider(RabbitmqClient)
      .useValue({ emitTo: rabbitMqEmitToMock })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    datasource = await getDatasource(app)

  });

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await cleanDatabase(datasource)
  })


  it('/songs (GET): get all songs', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const createSong = createSongEntity(app)
    const createGenre = createGenreEntity(app)
    const genre = await createGenre({ name: "rock" })
    const jouney = await createArtist({ name: "journey" })
    const frontiers = await createAlbum({ title: "fronties", artistId: jouney.id })
    await createSong({ title: "song1", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })
    await createSong({ title: "song2", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })
    await createSong({ title: "song3", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })

    const res = await request(app.getHttpServer())
      .get(`/songs`)
      .expect(HttpStatus.OK)

    expect(res.body).toHaveLength(3)
    const titles = res.body.map(song => song.title)
    expect(titles).toContain('song1')
    expect(titles).toContain('song2')
    expect(titles).toContain('song3')



  })

  it('/songs/:id (GET): get song by id', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const createSong = createSongEntity(app)
    const createGenre = createGenreEntity(app)
    const genre = await createGenre({ name: "rock" })
    const jouney = await createArtist({ name: "journey" })
    const frontiers = await createAlbum({ title: "fronties", artistId: jouney.id })
    await createSong({ title: "song1", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })
    const songtoFind = await createSong({ title: "song2", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })
    await createSong({ title: "song3", albumId: frontiers.id, artistId: jouney.id, genreId: genre.id })

    const res = await request(app.getHttpServer())
      .get(`/songs/${songtoFind.id}`)
      .expect(HttpStatus.OK)

    expect(res.body.id).toBeDefined()
    expect(res.body.title).toBe('song2')

  })


  it('/songs/artist/:id (GET): get song by artist id', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const createSong = createSongEntity(app)
    const createGenre = createGenreEntity(app)
    const genre = await createGenre({ name: "rock" })
    const journey = await createArtist({ name: "journey" })
    const frontiers = await createAlbum({ title: "fronties", artistId: journey.id })
    const escape = await createAlbum({ title: "scape", artistId: journey.id })
    await createSong({ title: "frontierSong1", albumId: frontiers.id, artistId: journey.id, genreId: genre.id })
    await createSong({ title: "frontierSong2", albumId: frontiers.id, artistId: journey.id, genreId: genre.id })
    await createSong({ title: "escapeSong1", albumId: escape.id, artistId: journey.id, genreId: genre.id })
    const bonjovi = await createArtist({ name: "bonjovi"})
    const bonjoviAlbum = await createAlbum({ title: "bonjovi", artistId: bonjovi.id })
    await createSong({ title: "runaway", albumId: bonjoviAlbum.id, artistId: bonjovi.id, genreId: genre.id })


    const res = await request(app.getHttpServer())
      .get(`/songs/artist/${journey.id}`)
      .expect(HttpStatus.OK)

    expect(res.body).toHaveLength(3)
    const titles = res.body.map(song => song.title)
    expect(titles).toContain('frontierSong1')
    expect(titles).toContain('frontierSong2')
    expect(titles).toContain('escapeSong1')

  })

  it('/songs/album/:id (GET): get songs by album id', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const createSong = createSongEntity(app)
    const createGenre = createGenreEntity(app)
    const genre = await createGenre({ name: "rock" })
    const journey = await createArtist({ name: "journey" })
    const frontiers = await createAlbum({ title: "fronties", artistId: journey.id })
    const escape = await createAlbum({ title: "scape", artistId: journey.id })
    await createSong({ title: "frontierSong1", albumId: frontiers.id, artistId: journey.id, genreId: genre.id })
    await createSong({ title: "frontierSong2", albumId: frontiers.id, artistId: journey.id, genreId: genre.id })
    await createSong({ title: "escapeSong1", albumId: escape.id, artistId: journey.id, genreId: genre.id })
    const bonjovi = await createArtist({ name: "bonjovi"})
    const bonjoviAlbum = await createAlbum({ title: "bonjovi", artistId: bonjovi.id })
    await createSong({ title: "runaway", albumId: bonjoviAlbum.id, artistId: bonjovi.id, genreId: genre.id })


    const res = await request(app.getHttpServer())
      .get(`/songs/album/${escape.id}`)
      .expect(HttpStatus.OK)

    expect(res.body).toHaveLength(1)
    const titles = res.body.map(song => song.title)
    expect(titles).toContain('escapeSong1')

  })


  it('/songs/genre/:id (GET): get songs by genre id', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const createSong = createSongEntity(app)
    const createGenre = createGenreEntity(app)
    const rock = await createGenre({ name: "rock" })
    const metal = await createGenre({ name: "metal" })
    const journey = await createArtist({ name: "journey" })
    const frontiers = await createAlbum({ title: "fronties", artistId: journey.id })
    const escape = await createAlbum({ title: "scape", artistId: journey.id })
    await createSong({ title: "frontierSong1", albumId: frontiers.id, artistId: journey.id, genreId: rock.id })
    await createSong({ title: "frontierSong2", albumId: frontiers.id, artistId: journey.id, genreId: rock.id })
    await createSong({ title: "escapeSong1", albumId: escape.id, artistId: journey.id, genreId: rock.id })
    const bonjovi = await createArtist({ name: "bonjovi"})
    const bonjoviAlbum = await createAlbum({ title: "bonjovi", artistId: bonjovi.id })
    await createSong({ title: "runaway", albumId: bonjoviAlbum.id, artistId: bonjovi.id, genreId: rock.id })

    const slayer = await createArtist({ name: "slayer"})
    const shownomercy = await createAlbum({ title: "show no mercy", artistId: slayer.id })
    await createSong({ title: "show no mercy", albumId: shownomercy.id, artistId: slayer.id, genreId: metal.id })

    const res = await request(app.getHttpServer())
      .get(`/songs/genre/${rock.id}`)
      .expect(HttpStatus.OK)

    expect(res.body).toHaveLength(4)
    const titles = res.body.map(song => song.title)
    expect(titles).toContain('escapeSong1')
    expect(titles).toContain('frontierSong1')
    expect(titles).toContain('frontierSong2')
    expect(titles).toContain('runaway')

  })


  it('/songs (POST): create a song', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const createGenre = createGenreEntity(app)
    const rock = await createGenre({ name: "rock" })
    const journey = await createArtist({ name: "journey" })
    const frontiers = await createAlbum({ title: "fronties", artistId: journey.id })
    
    const songToCreate: CreateSongRequest = {
          artistId: journey.id,
          albumId: frontiers.id,
          duration: 100,
          genreId: rock.id,
          plays: 10000,
          title: "separate ways",
          video: "video.avi"
    }
    const res = await request(app.getHttpServer())
      .post(`/songs`)
      .send(songToCreate)
      .expect(HttpStatus.CREATED)

    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(songToCreate.title)
    expect(res.body.duration).toBe(songToCreate.duration)
    expect(res.body.plays).toBe(songToCreate.plays)
    expect(res.body.video).toBe(songToCreate.video)
    expect(rabbitMqEmitToMock).toBeCalledTimes(1)
    expect(rabbitMqEmitToMock).toBeCalledWith('new-song', expect.any(Object))
  })

});
