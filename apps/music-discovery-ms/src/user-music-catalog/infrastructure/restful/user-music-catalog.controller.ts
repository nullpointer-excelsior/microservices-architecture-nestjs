import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserMusicCatalogUseCases } from "../../application/user-music-catalog.use-cases";
import { CreateUserMusicCatalogDto } from "../../application/dto/create-user-music-catalog.dto";

@Controller('user-music-catalog')
export class UserMusicCatalogController {

    constructor(private readonly catalog: UserMusicCatalogUseCases) {}

    @Post()
    createUserMusicCatalog(@Body() request: CreateUserMusicCatalogDto) {
        return this.catalog.createMusicCatalog(request);
    }

    @Get(':id')
    getUserMusicCatalogbyId(@Param('id') id: string) {
        return this.catalog.findMusicCatalogByUserId(id);
    }

}