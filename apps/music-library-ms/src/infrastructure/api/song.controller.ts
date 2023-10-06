import { Controller, Get, Param, Query } from "@nestjs/common";
import { SongUseCases } from "../../application/song.use-cases";
import { ApiInternalServerErrorResponse, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SongModel } from "../../domain/model/song.model";

@ApiTags('songs')
@Controller('songs')
export class SongController {

    constructor(private songs: SongUseCases) {}

    @Get('search')
    @ApiInternalServerErrorResponse({ 
        description: 'An error has been ocurred'
    })
    @ApiResponse({ 
        status: 200,
        description: 'The records has been successfully retrieved.',
        type: SongModel,
    })
    @ApiQuery({ 
        name: 'q', 
        description: 'Keywords for a song search'
    })
    searchByContainsName(@Query('q') name: string): Promise<SongModel[]> {
        return this.songs.searchByContainsName(name)
    }

    @Get(':artist')
    @ApiInternalServerErrorResponse({ 
        description: 'An error has been ocurred'
    })
    @ApiResponse({ 
        status: 200,
        description: 'The records has been successfully retrieved.',
        type: SongModel,
    })
    getByArtistName(@Param('artist') artist: string): Promise<SongModel[]> {
        return this.songs.findByArtist(artist)
    }

}