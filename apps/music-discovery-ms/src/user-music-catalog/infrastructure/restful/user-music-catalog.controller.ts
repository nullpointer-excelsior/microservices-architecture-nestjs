import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UserMusicCatalogUseCases } from "../../application/user-music-catalog.use-cases";
import { CreateUserMusicCatalogDto } from "../../application/dto/create-user-music-catalog.dto";
import { UpdatePlaylistsDto } from "../../application/dto/update-playlists.dto";

@Controller('user-music-catalog')
export class UserMusicCatalogController {

    constructor(private readonly catalog: UserMusicCatalogUseCases) {}

    @Post()
    createUserMusicCatalog(@Body() request: CreateUserMusicCatalogDto) {
        return this.catalog.createMusicCatalog(request);
    }

    @Put('playlists')
    updatePlaylists(@Body() request: UpdatePlaylistsDto) {
        return this.catalog.updatePlaylists(request);
    }

    @Get(':id')
    getUserMusicCatalogbyId(@Param('id') id: string) {
        return this.catalog.findMusicCatalogByUserId(id);
    }

}