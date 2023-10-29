import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { SongService } from "../../music-library-api/services/song.service";
import { Genre } from "../models/genre.model";
import { GenreService } from "../../music-library-api/services/genre.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver(of => Genre)
export class GenreResolver {
    
    constructor(private songService: SongService, private genreService: GenreService) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query(returns => [Genre])
    genres() {
        return this.genreService.findAll()
    }

    @ResolveField()
    songs(@Parent() genre: Genre) {
        return this.songService.findByGenreId(genre.id)
    }

}