import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PlayerService } from '../services/player.service';

@Controller('player')
export class PlayerController {

    constructor(private player: PlayerService) { }

    @Get('songs/:id')
    async getSong(@Param('id') id: string, @Res() res: Response) {

        const { Body, ContentType, ContentLength } = await this.player.getSongObject(id);

        const bytesArray = await Body.transformToByteArray()
        const buffer = Buffer.from(bytesArray)

        res.setHeader('Content-Type', ContentType)
        res.setHeader('Content-Length', ContentLength)
        res.send(buffer)

    }
}
