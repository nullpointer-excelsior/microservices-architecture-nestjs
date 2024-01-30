import { Controller, Get } from "@nestjs/common";
import { PlaylistUseCases } from "../../application/playlist.use-cases";

@Controller('playlists')
export class PlaylistController {

    constructor(private readonly playlist: PlaylistUseCases) {}
    
    @Get()
    getAll() {
        return this.playlist.findAll();
    }
    
}