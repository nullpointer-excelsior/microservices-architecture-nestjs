import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PlayerModule } from '../src/player/player.module';
import { DatabaseModule } from '../src/shared/database/database.module';



describe('Spotify Player (e2e)', () => {

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlayerModule, DatabaseModule.register({
        database: "test",
        host: "localhost",
        password:"test",
        port: 5555,
        username:"test",
      })],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/radios (GET)', () => {
    return request(app.getHttpServer())
      .get('/radios')
      .expect(200)
  });
});
