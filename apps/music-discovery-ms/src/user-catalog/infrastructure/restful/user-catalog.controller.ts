import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UserCatalogUseCases } from "../../application/user-catalog.use-cases";
import { CreateUserCatalogDto } from "../../application/dto/create-user-catalog.dto";
import { UpdatePlaylistsDto } from "../../application/dto/update-playlists.dto";
import { UpdateFavoritesDto } from "../../application/dto/update-favorites.dto";

@Controller('user-catalog')
export class UserCatalogController {

    constructor(private readonly catalog: UserCatalogUseCases) {}

    @Post()
    createUserMusicCatalog(@Body() request: CreateUserCatalogDto) {
        return this.catalog.createMusicCatalog(request);
    }

    @Put('playlists')
    updatePlaylists(@Body() request: UpdatePlaylistsDto) {
        return this.catalog.updatePlaylists(request);
    }

    @Put('favorites')
    updateFavorites(@Body() request: UpdateFavoritesDto) {
        return this.catalog.updateFavorites(request);
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.catalog.findById(id);
    }

    @Get('/user/:id')
    getUserMusicCatalogById(@Param('id') id: string) {
        return this.catalog.findMusicCatalogByUserId(id);
    }

}