import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateRadioDTO } from '../src/radio/application/dto/create-radio.dto';
import { UpdateSongsDTO } from '../src/radio/application/dto/update-songs.dto';
import { RadioModule } from '../src/radio/radio.module';
import mongoose from 'mongoose';

async function deleteCollection() {
  try {
    await mongoose.connect('mongodb://test:test@localhost:27020/test?authSource=admin');
    const db = mongoose.connection;
    const collectionName = 'radios';
    const eliminacion = await db.collection(collectionName).drop();
    console.log('Colección eliminada con éxito:', eliminacion);
  } catch (error) {
    console.log('Error al eliminar la colección:', error.message);
  }
}

describe('MusicDiscoveryMs (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RadioModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await deleteCollection()
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await app.close()
  })

  it('/radio (POST): create a radio', async () => {

    const radio: CreateRadioDTO = {
      id: "1B28A807-2314-4980-8D74-2F92F6C48869",
      name: "rock radio",
      songs: [
        {
          id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
          title: "runaway",
          album: "bonjovi",
          artist: "bonjovi",
          genre: "rock"
        },
        {
          id: "A48BCD55-B248-4377-8BCD-E9687768BA08",
          title: "separate ways",
          album: "journey",
          artist: "journey",
          genre: "rock"
        }
      ]
    }
    await request(app.getHttpServer())
      .post('/radios')
      .send(radio)
      .expect(HttpStatus.CREATED)

    const res = await request(app.getHttpServer())
      .get('/radios')

    expect(res.body).toHaveLength(1)
    expect(res.body[0].songs).toHaveLength(2)

  });

  it('/radio (POST): invalid UUID', async () => {

    const radio: CreateRadioDTO = {
      id: "hello",
      name: "rock radio",
      songs: []
    }
    await request(app.getHttpServer())
      .post('/radios')
      .send(radio)
      .expect(HttpStatus.BAD_REQUEST)

  });

  it('/radio/:id/songs (PUT): update radio songs', async () => {

    const radioId = "1B28A807-2314-4980-8D74-2F92F6C48869"
    const radio: CreateRadioDTO = {
      id: radioId,
      name: "rock radio",
      songs: []
    }
    await request(app.getHttpServer())
      .post('/radios')
      .send(radio)
      .expect(HttpStatus.CREATED)

    const songs: UpdateSongsDTO = {
      songs: [{
        id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
        title: "runaway",
        album: "bonjovi",
        artist: "bonjovi",
        genre: "rock"
      }]
    }
    await request(app.getHttpServer())
      .put(`/radios/${radioId}/songs`)
      .send(songs)
      .expect(HttpStatus.OK)

    const res = await request(app.getHttpServer())
      .get('/radios')

    expect(res.body).toHaveLength(1)
    expect(res.body[0].songs).toHaveLength(1)
    const song = res.body[0].songs[0]
    expect(song.title).toBe('runaway')

  });

  it('/radio/:id/songs (PUT): update radio songs with invalid id and receive 400 status code', async () => {
    const radioId = "invalid-id"
    let songs: UpdateSongsDTO = {
      songs: [
        {
          id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
          title: "runaway",
          album: "bonjovi",
          artist: "bonjovi",
          genre: "rock"
        }
      ]
    }
    await request(app.getHttpServer())
      .put(`/radios/${radioId}/songs`)
      .send(songs)
      .expect(HttpStatus.BAD_REQUEST)

    songs = {
      songs: [
        {
          id: "invalid-id",
          title: "runaway",
          album: "bonjovi",
          artist: "bonjovi",
          genre: "rock"
        }
      ]
    }
    await request(app.getHttpServer())
      .put(`/radios/A48BCD55-B248-4377-8BCD-E9687768BA07/songs`)
      .send(songs)
      .expect(HttpStatus.BAD_REQUEST)

  });

  it('/radio (GET): get a radio by id', async () => {

    const radioId = "1B28A807-2314-4980-8D74-2F92F6C48869"
    const radioToFind: CreateRadioDTO = {
      id: radioId,
      name: "rock radio",
      songs: [
        {
          id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
          title: "runaway",
          album: "bonjovi",
          artist: "bonjovi",
          genre: "rock"
        },
        {
          id: "A48BCD55-B248-4377-8BCD-E9687768BA08",
          title: "separate ways",
          album: "journey",
          artist: "journey",
          genre: "rock"
        }
      ]
    }
    await request(app.getHttpServer())
      .post('/radios')
      .send({
        id: "A48BCD55-B248-4377-8BCD-E9687768BA07",
        name: "rock radio",
        songs: [
          {
            id: "A48BCD55-B248-4377-8BCD-E9687768BA08",
            title: "separate ways",
            album: "journey",
            artist: "journey",
            genre: "rock"
          }
        ]
      })
      .expect(HttpStatus.CREATED)

    await request(app.getHttpServer())
      .post('/radios')
      .send(radioToFind)
      .expect(HttpStatus.CREATED)

    const res = await request(app.getHttpServer())
      .get(`/radios/${radioId}`)

    expect(res.body).toBeDefined()
    expect(res.body.name).toBe('rock radio')
    expect(res.body.songs).toHaveLength(2)
    const song = res.body.songs[0]
    expect(song.title).toBe('runaway')
  });


});
