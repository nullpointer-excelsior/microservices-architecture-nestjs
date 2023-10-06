import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ArtistUseCases } from "../../application/artist.use-cases";

@ApiTags('artists')
@Controller('artists')
export class ArtistController {

    constructor(private artist: ArtistUseCases) {}

    @Get()
    @ApiResponse({ 
        status: 200,
        description: 'The artist names available.',
    })
    getArtists() {
        return this.artist.findArtistNames()
    }

}