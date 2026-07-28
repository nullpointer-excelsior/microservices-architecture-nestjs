import { Controller, Get, Injectable, Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

@Injectable()
class FakeCatalogService {
    getHomeLibrary = async () => ({
        featured: [
            { id: 'f1', title: 'Featured Album', photo: 'photo.jpg' },
        ],
        recentlyPlayed: [
            { id: 's1', title: 'Song A', video: 'video.avi' },
        ],
    });
}

@Controller('home-library')
class TestHomeLibraryController {
    constructor(private readonly catalog: FakeCatalogService) {}

    @Get()
    getHomeLibrary() {
        return this.catalog.getHomeLibrary();
    }
}

@Module({ controllers: [TestHomeLibraryController], providers: [FakeCatalogService] })
class TestModule {}

describe('WebBff Home Library (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [TestModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('GET /home-library returns the aggregated payload', async () => {
        const res = await request(app.getHttpServer())
            .get('/home-library')
            .expect(200);
        expect(res.body.featured).toBeDefined();
        expect(res.body.featured).toHaveLength(1);
        expect(res.body.recentlyPlayed).toBeDefined();
        expect(res.body.recentlyPlayed).toHaveLength(1);
    });
});

describe('WebBff Media Server (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [TestModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('responds to the home library endpoint', async () => {
        await request(app.getHttpServer())
            .get('/home-library')
            .expect(200);
    });
});
