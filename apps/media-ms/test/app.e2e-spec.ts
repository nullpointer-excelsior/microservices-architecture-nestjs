import { Controller, Get, Logger, Param, Res, Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import type { Response } from 'express';
import * as request from 'supertest';

@Injectable()
class FakeAudioService {
    private objects: Record<string, { body: Buffer; contentType: string }> = {
        '1': { body: Buffer.from('fake-audio'), contentType: 'audio/mpeg' },
    };
    getSongObject = async (id: string) => this.objects[id];
}

@Injectable()
class FakeCoverService {
    private objects: Record<string, { body: Buffer; contentType: string }> = {
        'a1': { body: Buffer.from('fake-artist-cover'), contentType: 'image/png' },
        'al1': { body: Buffer.from('fake-album-cover'), contentType: 'image/png' },
    };
    getArtistCoverObject = async (id: string) => this.objects[id];
    getAlbumCoverObject = async (id: string) => this.objects[id];
}

async function fakeStream(res: Response, obj: any) {
    if (!obj) {
        res.status(404).end();
        return;
    }
    res.setHeader('Content-Type', obj.contentType);
    res.status(200).end(obj.body);
}

@Controller('audio')
class TestAudioController {
    constructor(private audio: FakeAudioService) {}

    @Get('songs/:id')
    async getSong(@Param('id') id: string, @Res() res: Response) {
        Logger.log(`audio-song:${id}`, 'PlayerController');
        const obj = await this.audio.getSongObject(id);
        await fakeStream(res, obj);
    }
}

@Controller('cover')
class TestCoverController {
    constructor(private cover: FakeCoverService) {}

    @Get('artists/:id')
    async getArtistCover(@Param('id') id: string, @Res() res: Response) {
        Logger.log(`cover-artist:${id}`, 'CoverController');
        const obj = await this.cover.getArtistCoverObject(id);
        await fakeStream(res, obj);
    }

    @Get('albums/:id')
    async getAlbumCover(@Param('id') id: string, @Res() res: Response) {
        Logger.log(`cover-album:${id}`, 'CoverController');
        const obj = await this.cover.getAlbumCoverObject(id);
        await fakeStream(res, obj);
    }
}

@Module({
    controllers: [TestAudioController, TestCoverController],
    providers: [FakeAudioService, FakeCoverService],
})
class TestModule {}

describe('Media API (e2e)', () => {
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

    it('GET /audio/songs/:id returns the audio binary', async () => {
        const res = await request(app.getHttpServer())
            .get('/audio/songs/1')
            .expect(200);
        expect(res.headers['content-type']).toContain('audio/mpeg');
        expect(res.body.toString()).toBe('fake-audio');
    });

    it('GET /audio/songs/:id returns 404 for unknown id', async () => {
        await request(app.getHttpServer())
            .get('/audio/songs/missing')
            .expect(404);
    });

    it('GET /cover/artists/:id returns the artist cover binary', async () => {
        const res = await request(app.getHttpServer())
            .get('/cover/artists/a1')
            .expect(200);
        expect(res.headers['content-type']).toContain('image/png');
        expect(res.body.toString()).toBe('fake-artist-cover');
    });

    it('GET /cover/albums/:id returns the album cover binary', async () => {
        const res = await request(app.getHttpServer())
            .get('/cover/albums/al1')
            .expect(200);
        expect(res.headers['content-type']).toContain('image/png');
        expect(res.body.toString()).toBe('fake-album-cover');
    });
});
