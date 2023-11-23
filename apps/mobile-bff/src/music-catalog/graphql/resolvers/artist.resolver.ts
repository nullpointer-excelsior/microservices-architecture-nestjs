/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Artist } from "../models/artist.model";
import { Span } from "nestjs-otel";
import { ArtistAPI } from "@lib/music-library-api";
import { AlbumAPI } from "@lib/music-library-api";

@Resolver(of => Artist)
export class ArtistResolver {

    constructor(
        private artistAPI: ArtistAPI,
        private albumAPI: AlbumAPI
    ) {}

    @Span("ArtistResolver/query/artistById")
    @Query(returns => Artist)
    artistById(@Args('id') id: string) {
        return this.artistAPI.findById(id)
    }

    @Span("ArtistResolver/query/artists")
    @Query(returns => [Artist])
    artists() {
        return this.artistAPI.findAll()
    }

    @Span("ArtistResolver/field/album")
    @ResolveField()
    async albums(@Parent() artist: Artist) {
        return this.albumAPI.findByArtistId(artist.id)
    }
    
}