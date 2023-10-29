import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Radio } from "../models/radio.model";
import { RadioService } from "../../music-library-api/services/radio.service";
import { Genre } from "../models/genre.model";
import { SongService } from "../../music-library-api/services/song.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver(of => Radio)
export class RadioResolver {

    constructor(
        private radioService: RadioService,
        private songService: SongService
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query(returns => [Radio])
    radios() {
        return this.radioService.findAll()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query(returns => Radio)
    radioById(@Args('id') id: string) {
        return this.radioService.findById(id)
    }

    @ResolveField()
    songs(@Parent() genre: Genre) {
        return this.songService.findByGenreId(genre.id)
    }
    
}