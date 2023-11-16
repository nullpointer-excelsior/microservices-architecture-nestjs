import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { RabbitmqClient } from '../../../libs/rabbitmq-queue/src/rabbitmq-queue/services/rabbitmq-client.service';
import { CreateArtistRequest } from '../src/music-library/dto/create-artist.request';
import { MusicLibraryModule } from '../src/music-library/music-library.module';
import { cleanDatabase, createArtistEntity, getDatasource } from './utils';


describe('Artist (e2e)', () => {

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
    datasource = await getDatasource(app)

    await app.init();

  });

  beforeEach(() => {
    cleanDatabase(datasource).then()
  })

  afterAll(async () => {
    await app.close()
  })

  // describe('Artists', () => {

    it('/artists (GET): get all artists', async () => {

      const create = createArtistEntity(app)
      await create({}) // deafult = journey
      await create({ name: "BonJovi" })
      await create({ name: "Scorpions" })

      return request(app.getHttpServer())
        .get('/artists')
        .expect(200)
        .then(res => res.body)
        .then(body => expect(body).toHaveLength(3))

    });


    it('/artists/:id (GET) get artist by id', async () => {
      const create = createArtistEntity(app)
      await create({})
      await create({ name: "BonJovi" })
      const toFind = await create({ name: "Scorpions" })

      return request(app.getHttpServer())
        .get(`/artists/${toFind.id}`)
        .expect(200)
        .then(res => res.body)
        .then(body => expect(body.name).toBe(toFind.name))

    });

    it('/artists (POST): create an artist', async () => {

      const artistData: CreateArtistRequest = {
        name: 'Example Artist',
        photo: 'https://example.com/photo.jpg',
        biography: 'This is the biography of the artist.',
      };

      const response = await request(app.getHttpServer())
        .post('/artists')
        .send(artistData)
        .expect(HttpStatus.CREATED);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toEqual(artistData.name);
      expect(response.body.photo).toEqual(artistData.photo);
      expect(response.body.biography).toEqual(artistData.biography);

    });

    it('/artists/:id (PUT): update artist', async () => {

      const create = createArtistEntity(app)
      const artistCreated = await create({ name: "BonJovi", photo: "photo.jpg" })
      const update = {
        ...artistCreated,
        photo: "bonjovi.jpg"
      }

      const response = await request(app.getHttpServer())
        .put(`/artists`)
        .send(update)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(artistCreated.id);
      expect(response.body.name).toEqual(update.name);
      expect(response.body.photo).toEqual(update.photo);
      expect(response.body.biography).toEqual(update.biography);

    });


    it('/artists/:id (DELETE): delete an artist ', async () => {

      const create = createArtistEntity(app)
      await create({ name: "BonJovi" })
      const toDelete = await create({ name: "Scorpions" })

      await request(app.getHttpServer())
        .get(`/artists`)
        .expect(HttpStatus.OK)
        .then(res => expect(res.body).toHaveLength(2));

      await request(app.getHttpServer())
        .delete(`/artists/${toDelete.id}`)
        .expect(HttpStatus.OK)

      await request(app.getHttpServer())
        .get(`/artists`)
        .expect(HttpStatus.OK)
        .then(res => expect(res.body).toHaveLength(1));
    });
  
  // })

});
