import { Controller, Get, Query } from "@nestjs/common";
import { SongUseCases } from "../../application/song.use-cases";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('songs')
@Controller('songs')
export class SongController {

    constructor(private songs: SongUseCases) {}

    @Get('search')
    searchByContainsName(@Query('q') name: string) {
        return this.songs.searchByContainsName(name)
    }

}