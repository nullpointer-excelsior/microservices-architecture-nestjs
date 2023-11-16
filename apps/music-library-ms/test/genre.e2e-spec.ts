import { HttpStatus, INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { cleanDatabase, createGenreEntity, getDatasource } from "./utils";
import { TestingModule, Test } from "@nestjs/testing";
import { MusicLibraryModule } from "../src/music-library/music-library.module";
import * as request from 'supertest';
import { CreateGenreRequest } from "../src/music-library/dto/create-genre.request";



describe('Genre (e2e)', () => {

    let app: INestApplication;
    let datasource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                MusicLibraryModule
            ]
        })
            .compile();

        app = moduleFixture.createNestApplication();
        datasource = await getDatasource(app)
        await app.init();
    })

    beforeEach(() => {
        cleanDatabase(datasource).then()
    })

    afterAll(async () => {
        await app.close()
    })

    it('/genres (GET): get all genres', async () => {

        const create = createGenreEntity(app)
        await create({ name: 'metal' })
        await create({ name: 'blackmetal' })
        await create({ name: 'deathmetal' })

        return request(app.getHttpServer())
            .get('/genres')
            .expect(HttpStatus.OK)
            .then(res => res.body)
            .then(genres => {
                expect(genres).toHaveLength(3)
            });

    })

    it('/genres/:id (GET): get by id', async () => {

        const create = createGenreEntity(app)
        await create({ name: 'blackmetal' })
        const metal = await create({ name: 'metal' })

        return request(app.getHttpServer())
            .get(`/genres/${metal.id}`)
            .expect(HttpStatus.OK)
            .then(res => res.body)
            .then(genre => {
                expect(genre.name).toBe('metal')
            });

    })

    it('/genres (POST): create a genre', async () => {
        return request(app.getHttpServer())
            .post('/genres')
            .send({ name: "Metal" } as CreateGenreRequest)
            .expect(HttpStatus.CREATED);
    })

    it('/genres (PUT): update a genre', async () => {

        const create = createGenreEntity(app)
        await create({ name: 'metal' })
        const toEdit = await create({ name: 'punk' })
        toEdit.name = "rock"

        return request(app.getHttpServer())
            .put('/genres')
            .send(toEdit)
            .expect(HttpStatus.OK)
            .then(res => res.body)
            .then(genre => {
                expect(genre.name).toBe('rock')
            });
    })

    it('/genres (DELETE): delete a genre', async () => {

        const create = createGenreEntity(app)
        await create({ name: 'metal' })
        await create({ name: 'rock' })
        const toDelete = await create({ name: 'punk' })

        await request(app.getHttpServer())
            .get(`/genres`)
            .expect(HttpStatus.OK)
            .then(res => res.body)
            .then(genre => expect(genre).toHaveLength(3));

        await request(app.getHttpServer())
            .delete(`/genres/${toDelete.id}`)
            .expect(HttpStatus.OK);

        await request(app.getHttpServer())
            .get(`/genres`)
            .expect(HttpStatus.OK)
            .then(res => res.body)
            .then(genre => expect(genre).toHaveLength(2));
    })


})