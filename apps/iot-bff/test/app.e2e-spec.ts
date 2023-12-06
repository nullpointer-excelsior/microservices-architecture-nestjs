import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IotBffModule } from './../src/iot-bff.module';
import { MusicLibraryService } from '../src/grpc/services/music-library.service';

describe('IOT-bff (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IotBffModule],
    })
    .overrideProvider(MusicLibraryService)
    .useValue({
      findAllArtists: () => jest.fn().mockReturnValue([]),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
