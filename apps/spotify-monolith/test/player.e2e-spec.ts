import { Controller, Get, Post, Param, Body, Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

@Injectable()
class FakeRadioUseCases {
    findAll = async () => [
        { id: 'r1', name: 'rock radio' },
        { id: 'r2', name: 'metal radio' },
    ];
    findByGenreId = async (_id: string) => [
        { id: 'r1', name: 'rock radio' },
    ];
    create = async (req: any) => ({ id: 'new', ...req });
}

@Controller('radios')
class TestRadioController {
    constructor(private readonly radio: FakeRadioUseCases) {}

    @Get()
    findAll() {
        return this.radio.findAll();
    }

    @Get('genre/:id')
    findByGenre(@Param('id') id: string) {
        return this.radio.findByGenreId(id);
    }

    @Post()
    create(@Body() body: any) {
        return this.radio.create(body);
    }
}

describe('Spotify Monolith Radio API (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [TestRadioController],
            providers: [FakeRadioUseCases],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('GET /radios returns the radio list', async () => {
        const res = await request(app.getHttpServer())
            .get('/radios')
            .expect(200);
        expect(res.body).toHaveLength(2);
        expect(res.body.map((r: any) => r.name)).toEqual(['rock radio', 'metal radio']);
    });

    it('GET /radios/genre/:id returns radios for a genre', async () => {
        const res = await request(app.getHttpServer())
            .get('/radios/genre/g1')
            .expect(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST /radios creates a radio and returns the new id', async () => {
        const res = await request(app.getHttpServer())
            .post('/radios')
            .send({ name: 'pop radio', genre: 'g1' })
            .expect(201);
        expect(res.body.id).toBe('new');
    });
});
