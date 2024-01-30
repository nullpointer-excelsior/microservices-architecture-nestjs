import { Controller, Get, Param } from "@nestjs/common";
import { UserMusicCatalogUseCases } from "../../application/user-music-catalog.use-cases";

@Controller('user-music-catalog')
export class UserMusicCatalogController {

    constructor(private readonly catalog: UserMusicCatalogUseCases) {}

    @Get(':id')
    getUserMusicCatalogbyId(@Param('id') id: string) {
        return this.catalog.findMusicCatalogByUserId(id);
    }

}