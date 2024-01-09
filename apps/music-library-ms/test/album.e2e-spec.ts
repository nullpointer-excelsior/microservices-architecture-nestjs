import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MusicLibraryMsModule } from '../src/music-library-ms.module';
import { cleanDatabase, createAlbumEntity, createArtistEntity } from './utils';


describe('Album (e2e)', () => {

  let app: INestApplication;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MusicLibraryMsModule
      ]
    })
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();

  });

  beforeEach(async () => {
    await cleanDatabase(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('/albums GET', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const artist = await createArtist({ name: "journey" })

    await createAlbum({ title: 'Album 1', artistId: artist.id, photo: 'phot.jpg', year: 1998 })
    await createAlbum({ title: 'Album 2', artistId: artist.id, photo: 'photo.jpg', year: 2000 })

    const res = await request(app.getHttpServer())
      .get('/albums')
      .expect(HttpStatus.OK)

    expect(res.body).toHaveLength(2)
    expect(res.body.map(el => el.title).every(el => ['Album 1', 'Album 2'].includes(el))).toBe(true)

  })

  it('/albums/:id (GET): get album by id', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const artist = await createArtist({ name: "journey" })

    await createAlbum({ title: 'Album 1', artistId: artist.id, photo: 'phot.jpg', year: 1998 })
    const albumTofind = await createAlbum({ title: 'Album 2', artistId: artist.id, photo: 'photo.jpg', year: 2000 })

    const res = await request(app.getHttpServer())
      .get(`/albums/${albumTofind.id}`)
      .expect(HttpStatus.OK)

    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(albumTofind.title)

  })

  it('/albums/artist/:id (GET): get album by id', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)

    const journey = await createArtist({ name: "journey" })
    const bonjovi = await createArtist({ name: "bonjovi" })
    await createAlbum({ title: 'Frontiers', artistId: journey.id })
    await createAlbum({ title: 'Escape', artistId: journey.id })
    await createAlbum({ title: 'Bounce', artistId: bonjovi.id })

    const res = await request(app.getHttpServer())
      .get(`/albums/artist/${journey.id}`)
      .expect(HttpStatus.OK)

    expect(res.body).toHaveLength(2)
    const titles = res.body.map(item => item.title)
    expect(titles).toContain('Frontiers')
    expect(titles).toContain('Escape')

  })

  it('/albums (POST): create an album', async () => {
    const createArtist = createArtistEntity(app)
    const artist = await createArtist({ name: "journey" })
    const albumToCreate = { title: 'Album 3', artistId: artist.id, photo: 'phot.jpg', year: 1998 }
    const res = await request(app.getHttpServer())
      .post('/albums')
      .send(albumToCreate)
      .expect(HttpStatus.CREATED);

    expect(res.body.id).toBeDefined()
    expect(albumToCreate.title).toBe(res.body.title)
    expect(albumToCreate.photo).toBe(res.body.photo)
    expect(albumToCreate.year).toBe(res.body.year)

  })

  it('/albums (PUT): update an album', async () => {

    const createArtist = createArtistEntity(app)
    const createAlbum = createAlbumEntity(app)
    const artist = await createArtist({ name: "journey" })

    const albumToCreate = { title: 'Album 3', artistId: artist.id, photo: 'photo.jpg', year: 1998 }
    const album = await createAlbum(albumToCreate)

    const albumToUpdate = { id: album.id, title: 'Album updated', photo: 'updated.jpg', year: 1998 }

    const res = await request(app.getHttpServer())
      .put(`/albums`)
      .send(albumToUpdate)
      .expect(200);

    const albums = res.body;
    expect(albums).toBeDefined();
    expect(albums.title).toBe(albumToUpdate.title);
    expect(albums.photo).toBe(albumToUpdate.photo);
    expect(albums.year).toBe(albumToCreate.year);


  })


});
