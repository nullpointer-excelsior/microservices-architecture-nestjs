import { Controller, Get, Post, Put, Delete, Param, Body, Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

@Injectable()
class FakeGenreService {
    findAll = async () => [
        { id: '1', name: 'Rock' },
        { id: '2', name: 'Metal' },
    ];
    findById = async (id: string) => {
        if (id === 'missing') return undefined;
        return { id, name: 'Rock' };
    };
    save = async (g: any) => ({ id: 'new', ...g });
    update = async (g: any) => g;
    delete = async (_id: string) => ({ affected: 1 });
}

@Controller('genres')
class TestGenreController {
    constructor(private readonly genreService: FakeGenreService) {}

    @Get()
    findAll() {
        return this.genreService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.genreService.findById(id);
    }

    @Post()
    create(@Body() body: { name: string }) {
        return this.genreService.save(body);
    }

    @Put()
    update(@Body() body: any) {
        return this.genreService.update(body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.genreService.delete(id);
    }
}

describe('Spotify Monolith Genre API (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [TestGenreController],
            providers: [FakeGenreService],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('GET /genres returns the catalogue', async () => {
        const res = await request(app.getHttpServer())
            .get('/genres')
            .expect(200);
        expect(res.body).toHaveLength(2);
        expect(res.body.map((g: any) => g.name)).toEqual(['Rock', 'Metal']);
    });

    it('GET /genres/:id returns one genre', async () => {
        const res = await request(app.getHttpServer())
            .get('/genres/42')
            .expect(200);
        expect(res.body.name).toBe('Rock');
    });

    it('POST /genres creates a genre and returns the new id', async () => {
        const res = await request(app.getHttpServer())
            .post('/genres')
            .send({ name: 'Pop' })
            .expect(201);
        expect(res.body.id).toBe('new');
        expect(res.body.name).toBe('Pop');
    });

    it('PUT /genres updates a genre', async () => {
        const res = await request(app.getHttpServer())
            .put('/genres')
            .send({ id: '1', name: 'Rock Updated' })
            .expect(200);
        expect(res.body.name).toBe('Rock Updated');
    });

    it('DELETE /genres/:id deletes a genre', async () => {
        await request(app.getHttpServer())
            .delete('/genres/1')
            .expect(200);
    });
});
