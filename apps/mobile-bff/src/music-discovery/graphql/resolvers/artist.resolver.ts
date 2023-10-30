/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Artist } from "../models/artist.model";
import { ArtistService } from "../../music-library-api/services/artist.service";
import { AlbumService } from "../../music-library-api/services/album.service";
import { Span } from "nestjs-otel";

@Resolver(of => Artist)
export class ArtistResolver {

    constructor(
        private artistService: ArtistService,
        private albumService: AlbumService
    ) {}

    @Span("ArtistResolver/query/artistById")
    @Query(returns => Artist)
    artistById(@Args('id') id: string) {
        return this.artistService.findById(id)
    }

    @Span("ArtistResolver/query/artists")
    @Query(returns => [Artist])
    artists() {
        return this.artistService.findAll()
    }

    @Span("ArtistResolver/field/album")
    @ResolveField()
    async albums(@Parent() artist: Artist) {
        return this.albumService.findByArtistId(artist.id)
    }
    
}