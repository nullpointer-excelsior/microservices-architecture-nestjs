import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MusicLibraryModule } from '../src/music-library/music-library.module';
import { DatabaseModule } from '../src/shared/database/database.module';
import { Genre } from '../src/shared/database/entities/genre.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';



describe('Spotify Music Library (e2e)', () => {

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MusicLibraryModule, 
        DatabaseModule.register({
        database: "test",
        host: "localhost",
        password:"test",
        port: 5555,
        username:"test",
      }),
      EventEmitterModule.forRoot()
    ],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/genres (POST)', () => {
    const g = new Genre()
    g.name = "Rock"
    return request(app.getHttpServer())
      .post('/genres')
      .send(g)
      .expect(201)
  });


});
