import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Artist } from "../models/artist.model";
import { ArtistService } from "../../music-library-api/services/artist.service";
import { AlbumService } from "../../music-library-api/services/album.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver(of => Artist)
export class ArtistResolver {

    constructor(
        private artistService: ArtistService,
        private albumService: AlbumService
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query(returns => Artist)
    artistById(@Args('id') id: string) {
        return this.artistService.findById(id)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query(returns => [Artist])
    artists() {
        return this.artistService.findAll()
    }

    @ResolveField()
    async albums(@Parent() artist: Artist) {
        return this.albumService.findByArtistId(artist.id)
    }
    
}