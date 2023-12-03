/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Genre } from "../models/genre.model";
import { Span } from "nestjs-otel";
import { GenreAPI, SongAPI } from "@lib/music-library-api";

@Resolver(of => Genre)
export class GenreResolver {
    
    constructor(
        private songAPI: SongAPI, 
        private genreAPI: GenreAPI
    ) {}

    @Span("GenreResolver/query/genres")
    @Query(returns => [Genre])
    genres() {
        return this.genreAPI.findAll()
    }

    @Span("GenreResolver/query/genreById")
    @Query(returns => Genre)
    async genreById(@Args('id') id: string) {
        return this.genreAPI.findById(id)
    }

    @Span("GenreResolver/field/songs")
    @ResolveField()
    songs(@Parent() genre: Genre) {
        return this.songAPI.findByGenreId(genre.id)
    }

}