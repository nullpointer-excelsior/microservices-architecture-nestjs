import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { SongModel } from '../src/domain/model/song.model';
import { SongRepository } from '../src/infrastructure/persistence/song.repository';
import { MusicLibraryMsModule } from './../src/music-library-ms.module';
import * as crypto from 'crypto';
import { PersistenceModule } from '../src/infrastructure/persistence/persistence.module';


function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex');
}

describe('MusicLibraryMsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MusicLibraryMsModule],
    })
    .overrideModule(PersistenceModule)
    // .useModule(PersistenceModule.register({
    //   database: "test",
    //   host: "localhost",
    //   password: "test",
    //   port: 5432,
    //   username: "test"
    // }))
    .useModule(PersistenceModule)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/songs/search (GET)', async () => {
    const songRepo: SongRepository = app.get(SongRepository)
    const song = SongModel.create({ 
      name: "" ,
      id: generateUUID(), 
      album: "", 
      artist: "journey", 
      genre:"rock", 
      trackUrl: "" 
    })
    
    await songRepo.save(song)

    return request(app.getHttpServer())
      .get('/songs/search')
      .query('q=journey')
      .expect(200)
      .expect({ data: [song] });
  });
});
