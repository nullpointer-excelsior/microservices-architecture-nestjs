import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Album } from "../models/album.model";
import { SongService } from "../../music-library-api/services/song.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver(of => Album)
export class AlbumResolver {
    
    constructor(private songService: SongService) {}

    @ResolveField()
    songs(@Parent() album: Album) {
        return this.songService.findByAlbumId(album.id)
    }

}