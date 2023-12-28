import { Controller, Get } from "@nestjs/common";
import { CatalogService } from "../services/catalog.service";


@Controller('home-library')
export class HomeLibraryController {

    constructor(private readonly catalog: CatalogService) {}

    @Get()
    getHomeLibrary() {
        return this.catalog.getHomeLibrary()
    }
}