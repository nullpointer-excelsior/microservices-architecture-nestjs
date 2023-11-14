import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { MusicLibraryModule } from '../src/music-library/music-library.module';
import * as fs from 'fs';
import { CreateArtistRequest } from '../src/music-library/dto/create-artist.request';


function createArtist(app: INestApplication, artistData: CreateArtistRequest) {
  return request(app.getHttpServer())
  .post('/artists')
  .send(artistData)
  .expect(HttpStatus.CREATED);
}


describe('MusicLibrary (e2e) Artists Endpoint', () => {
  
  let app: INestApplication;

  beforeAll(async () => {
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MusicLibraryModule
      ],
    })
    .compile();

    app = moduleFixture.createNestApplication();

    const data = fs.readFileSync('apps/music-library-ms/test/data.sql', 'utf8');
    const ds = app.get<DataSource>(DataSource)
    await ds.manager.connection.query(data)

    await app.init();

  });

  describe('Artists',() => {
    
    it('/artists (GET) get all artists', async () => {
      return request(app.getHttpServer())
        .get('/artists')
        .expect(200)
        .then(response => {
          console.log(response.body.map(x => x.id))
          expect(response.body).toHaveLength(3)
          expect(response.body.map(el => el.name).every(el => ['Bon Jovi', 'Journey', 'Slayer'].includes(el))).toBe(true)
      })
    });
  
  
    it('/artists/:id (GET) get artist by id: 90657e67-76ec-4457-bd3a-3a0dbf13dc43', async () => {
      const id ='90657e67-76ec-4457-bd3a-3a0dbf13dc43'
      return request(app.getHttpServer())
        .get(`/artists/${id}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Bon Jovi')
      })
  
      
    });
  
    it('/artists (POST)', async () => {
      
      const artistData: CreateArtistRequest = {
        name: 'Example Artist',
        photo: 'https://example.com/photo.jpg',
        biography: 'This is the biography of the artist.',
      };
      const response = await createArtist(app, artistData)
  
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toEqual(artistData.name);
      expect(response.body.photo).toEqual(artistData.photo);
      expect(response.body.biography).toEqual(artistData.biography);
  
    });
  
    it('/PUT /artists/:id', async () => {
  
      const artistData: CreateArtistRequest = {
        name: 'Example Artist',
        photo: 'https://example.com/photo.jpg',
        biography: 'This is the biography of the artist.',
      };
      const artistCreated = await createArtist(app, artistData).then(res => res.body)
  
      const updatedArtistData = {
        id: artistCreated.id,
        name: 'Updated Artist Name',
        photo: 'https://example.com/updated-photo.jpg',
        biography: 'This is the updated biography of the artist.',
      };
      const response = await request(app.getHttpServer())
        .put(`/artists`)
        .send(updatedArtistData)
        .expect(HttpStatus.OK);
  
      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(artistCreated.id); // Aseguramos que el ID sigue siendo el mismo
      expect(response.body.name).toEqual(updatedArtistData.name);
      expect(response.body.photo).toEqual(updatedArtistData.photo);
      expect(response.body.biography).toEqual(updatedArtistData.biography);
    });
  
  
    it('/DELETE /artists/:id', async () => {
  
      const artistData: CreateArtistRequest = {
        name: 'Example Artist to delete',
        photo: 'https://example.com/photo.jpg',
        biography: 'This is the biography of the artist.',
      };
      const artistCreated = await createArtist(app, artistData).then(res => res.body)
  
      const response = await request(app.getHttpServer())
        .delete(`/artists/${artistCreated.id}`)
        .expect(HttpStatus.OK);
  
      console.log('RESPONSE', response.body)
  
      await request(app.getHttpServer())
        .get(`/artists/${artistCreated.id}`)
        .expect(HttpStatus.NOT_FOUND);
  
    });
  })

});
