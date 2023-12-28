import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AudioService } from '../services/audio.service';
import { generateStream } from './utils/generate-stream';

@Controller('audio')
export class AudioController {

    constructor(private audio: AudioService) { }

    @Get('songs/:id')
    async getSong(@Param('id') id: string, @Res() res: Response) {
        Logger.log(`audio-song:${id}`, 'PlayerController')
        const s3object = await this.audio.getSongObject(id);
        await generateStream(res, s3object);
    }
}
