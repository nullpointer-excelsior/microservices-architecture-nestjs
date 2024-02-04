import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { SharedModule } from "../src/shared/shared.module";
import { UserCatalogModule } from "../src/user-catalog/user-catalog.module";
import { PlaylistsModule } from "../src/playlist-catalog/playlists.module";
import { CreateUserCatalogDto } from "../src/user-catalog/application/dto/create-user-catalog.dto";
import { UpdatePlaylistsDto } from "../src/user-catalog/application/dto/update-playlists.dto";
import { UpdateFavoritesDto } from "../src/user-catalog/application/dto/update-favorites.dto";

describe('UserMusicCatalog', () => {

    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserCatalogModule, SharedModule, PlaylistsModule],
        })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close()
    })

    it('/user-catalog/user/:id (GET): get user music catalog', async () => {
            
            const uuid = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
            const user = "dummy"
            const userMusicCatalog: CreateUserCatalogDto = {
                userId: uuid,
                username: user,
            }
            const catalog = await request(app.getHttpServer())
                .post('/user-catalog')
                .send(userMusicCatalog)
                .expect(HttpStatus.CREATED)

            const res = await request(app.getHttpServer())  
                .get(`/user-catalog/user/${uuid}`)
                .expect(HttpStatus.OK)
            
            expect(res.body).toBeDefined()

        });

    it('/user-catalog (POST): create a user music catalog', async () => {

        const uuid = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const user = "dummy"
        const userMusicCatalog: CreateUserCatalogDto = {
            userId: uuid,
            username: user,
        }
        await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)
            .expect(HttpStatus.CREATED)

        const res = await request(app.getHttpServer())
            .get(`/user-catalog/user/${uuid}`)

        expect(res.body).toBeDefined()
        expect(res.body.username).toBe(user)
        expect(res.body.userId).toBe(uuid)
        expect(res.body.playlists).toEqual([])
        expect(res.body.favorites).toEqual({ songs: [], artists: [], albums: [] })

    });

    it('/user-catalog/ (PUT) update playlists', async () => {

        const uuid = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const user = "dummy"

        const userMusicCatalog: CreateUserCatalogDto = {
            userId: uuid,
            username: user,
        }
        const userCatalog = await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)

        const updatePlaylists: UpdatePlaylistsDto = {
            userCatalogId: uuid,
            playlist: {
                id: "1",
                isPublic: true,
                name: "Rock and metal",
                songs: []
            }
        }
        expect(userCatalog.body.playlists).toEqual([])

        const playlistUpdated = await request(app.getHttpServer())
            .put('/user-catalog/playlists')
            .send(updatePlaylists)

        expect(playlistUpdated.body).toBeDefined()
        expect(playlistUpdated.body.playlists).toEqual([updatePlaylists.playlist])

        const playlists = await request(app.getHttpServer())
            .get(`/playlists`)

        expect(playlists.body).toBeDefined()
        expect(playlists.body[0].name).toEqual(updatePlaylists.playlist.name)

    });


    it('/user-catalog/ (PUT) update favorites', async () => {

        const uuid = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const user = "dummy"
        const userMusicCatalog: CreateUserCatalogDto = {
            userId: uuid,
            username: user,
        }
        await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)
            .expect(HttpStatus.CREATED)

        const updateFavorites: UpdateFavoritesDto = {
            userId: uuid,
            favorites: {
                songs: [{
                    id: "8b15d86f-07ff-427c-bee7-504b2d5b83f5",
                    title: "runaway"
                }],
                artists: [],
                albums: []
            }
        }

        const userCatalog = await request(app.getHttpServer())
            .put('/user-catalog/favorites')
            .send(updateFavorites)
            .expect(HttpStatus.OK)

        expect(userCatalog.body.favorites).toEqual({
            songs: [{
                id: "8b15d86f-07ff-427c-bee7-504b2d5b83f5",
                title: "runaway"
            }],
            artists: [],
            albums: []
        })

    });
})