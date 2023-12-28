import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CoverService } from '../services/cover.service';
import { generateStream } from './utils/generate-stream';

@Controller('cover')
export class CoverController {

    constructor(private cover: CoverService) { }

    @Get('artists/:id')
    async getArtistCover(@Param('id') id: string, @Res() res: Response) {
        Logger.log(`artist-media:${id}`, 'CoverController')
        const s3object = await this.cover.getArtistCoverObject(id);
        await generateStream(res, s3object);
    }

    @Get('albums/:id')
    async getAlbumCover(@Param('id') id: string, @Res() res: Response) {
        Logger.log(`album-media:${id}`, 'CoverController')
        const s3object = await this.cover.getAlbumCoverObject(id);
        await generateStream(res, s3object);
    }

}
