/* eslint-disable @typescript-eslint/no-unused-vars */
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { SongService } from "../../music-library-api/services/song.service";
import { Genre } from "../models/genre.model";
import { GenreService } from "../../music-library-api/services/genre.service";
import { Span } from "nestjs-otel";

@Resolver(of => Genre)
export class GenreResolver {
    
    constructor(private songService: SongService, private genreService: GenreService) {}

    @Span("GenreResolver/query/genres")
    @Query(returns => [Genre])
    genres() {
        return this.genreService.findAll()
    }

    @Span("GenreResolver/field/songs")
    @ResolveField()
    songs(@Parent() genre: Genre) {
        return this.songService.findByGenreId(genre.id)
    }

}