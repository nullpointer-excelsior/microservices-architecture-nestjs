import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AudioService } from '../services/audio.service';

@Controller('player')
export class AudioController {

    constructor(private player: AudioService) { }

    @Get('songs/:id')
    async getSong(@Param('id') id: string, @Res() res: Response) {
        Logger.log(`audio-media:${id}`, 'PlayerController')
        const { Body, ContentType, ContentLength } = await this.player.getSongObject(id);

        const bytesArray = await Body.transformToByteArray()
        const buffer = Buffer.from(bytesArray)

        res.setHeader('Content-Type', ContentType)
        res.setHeader('Content-Length', ContentLength)
        res.send(buffer)

    }
}
