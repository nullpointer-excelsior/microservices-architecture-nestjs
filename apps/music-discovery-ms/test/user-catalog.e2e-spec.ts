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
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close()
    })

    it('/user-catalog/user/:id (GET): get user music catalog', async () => {

        const id = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const userId = "8b15d86f-07ff-427c-bee7-345b2d5b83f5"
        const user = "dummy"
        const userMusicCatalog: CreateUserCatalogDto = {
            id: id,
            user: {
                id: userId,
                username: user
            }
        }
        await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)
            .expect(HttpStatus.CREATED)

        const res = await request(app.getHttpServer())
            .get(`/user-catalog/user/${userId}`)
            .expect(HttpStatus.OK)

        expect(res.body).toBeDefined()

    });

    it('/user-catalog/:id (GET): get by id', async () => {

        const id = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const userId = "8b15d86f-07ff-427c-bee7-345b2d5b83f5"
        const user = "dummy"
        const userMusicCatalog: CreateUserCatalogDto = {
            id: id,
            user: {
                id: userId,
                username: user
            }
        }
        await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)
            .expect(HttpStatus.CREATED)

        const res = await request(app.getHttpServer())
            .get(`/user-catalog/${id}`)
            .expect(HttpStatus.OK)

        expect(res.body).toBeDefined()

    });



    it('/user-catalog (POST): create a user music catalog', async () => {

        const id = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const username = "dummy"
        const userId = "1b15d86f-07ff-427c-bee7-345b2d5b83f5"
        const userMusicCatalog: CreateUserCatalogDto = {
            id: id,
            user: {
                id: userId,
                username: username
            }
        }
        await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)
            .expect(HttpStatus.CREATED)

        const res = await request(app.getHttpServer())
            .get(`/user-catalog/${id}`)

        expect(res.body).toBeDefined()
        expect(res.body.id).toBe(id)
        expect(res.body.user.username).toBe(username)
        expect(res.body.user.id).toBe(userId)
        expect(res.body.playlists).toEqual([])
        expect(res.body.favorites).toEqual({ songs: [], artists: [], albums: [] })

    });

    it('/user-catalog/ (PUT) update playlists from user catalog and catalog-playlists updated', async () => {

        const id = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const username = "dummy"
        const userId = "1b15d86f-07ff-427c-bee7-345b2d5b83f5"

        const userMusicCatalog: CreateUserCatalogDto = {
            id: id,
            user: {
                id: userId,
                username: username
            }
        }
        const userCatalog = await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)

        const updatePlaylists: UpdatePlaylistsDto = {
            userCatalogId: id,
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

    it('/user-catalog/ (PUT) update playlists from user catalog and catalog-playlists not updated', async () => {

        const id = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const username = "dummy"
        const userId = "1b15d86f-07ff-427c-bee7-345b2d5b83f5"

        const userMusicCatalog: CreateUserCatalogDto = {
            id: id,
            user: {
                id: userId,
                username: username
            }
        }
        const userCatalog = await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)

        const updatePlaylists: UpdatePlaylistsDto = {
            userCatalogId: id,
            playlist: {
                id: "1",
                isPublic: false,
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
        expect(playlists.body).toEqual([])

    });

    it('/user-catalog/ (PUT) update favorites', async () => {

        const id = "8b15d86f-07ff-427c-bee7-504b2d5b83f5"
        const username = "dummy"
        const userMusicCatalog: CreateUserCatalogDto = {
            id: id,
            user: {
                id: id,
                username: username
            }
        }
        await request(app.getHttpServer())
            .post('/user-catalog')
            .send(userMusicCatalog)
            .expect(HttpStatus.CREATED)

        const updateFavorites: UpdateFavoritesDto = {
            userId: id,
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