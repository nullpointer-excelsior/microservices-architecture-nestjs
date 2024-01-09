/* eslint-disable @typescript-eslint/no-unused-vars */
import { MusicCatalogClient } from "@lib/music-library-grpc";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Span } from "nestjs-otel";
import { toArray } from "rxjs";
import { Genre } from "../models/genre.model";

@Resolver(of => Genre)
export class GenreResolver {
    
    constructor(private grpc: MusicCatalogClient) {}

    @Span("GenreResolver/query/genres")
    @Query(returns => [Genre])
    genres() {
        return this.grpc.findAllGenres().pipe(toArray())
    }

    @Span("GenreResolver/query/genreById")
    @Query(returns => Genre)
    async genreById(@Args('id') id: string) {
        return this.grpc.findGenreById(id)
    }

    @Span("GenreResolver/field/songs")
    @ResolveField()
    songs(@Parent() genre: Genre) {
        return this.grpc.findSongsByGenreId(genre.id).pipe(toArray())
    }

}