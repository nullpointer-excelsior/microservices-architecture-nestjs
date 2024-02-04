import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from 'supertest';
import { Playlist } from "../src/playlist-catalog/domain/model/playlist.model";
import { CreateUserMusicCatalogDto } from "../src/user-music-catalog/application/dto/create-user-music-catalog.dto";
import { UserMusicCatalogModule } from "../src/user-music-catalog/user-music-catalog.module";
import e from "express";
import { SharedModule } from "../src/shared/shared.module";
import exp from "constants";

describe('UserMusicCatalog', () => {

    let app: INestApplication;
    
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [UserMusicCatalogModule, SharedModule],
        })
        .compile();
    
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });
    
    afterAll(async () => {
        await app.close()
    })
    
    it('/user-music-catalog (POST): create a user music catalog', async () => {
    
        const uuid = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const user = "dummy"
        const userMusicCatalog: CreateUserMusicCatalogDto = {
            userId: uuid,
            username: user,
        }
        await request(app.getHttpServer())
        .post('/user-music-catalog')
        .send(userMusicCatalog)
        .expect(HttpStatus.CREATED)
    
        const res = await request(app.getHttpServer())
        .get(`/user-music-catalog/${uuid}`)
        
        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(user)
        expect(res.body.userId).toBe(uuid)
        expect(res.body.playlists).toEqual([])
        expect(res.body.favorites).toEqual({ songs: [], artists: [], albums: [] })
    
    });
    
    
})