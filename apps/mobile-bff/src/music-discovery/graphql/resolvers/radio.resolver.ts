/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Radio } from "../models/radio.model";
import { RadioService } from "../../music-library-api/services/radio.service";
import { Genre } from "../models/genre.model";
import { SongService } from "../../music-library-api/services/song.service";
import { Span } from "nestjs-otel";

@Resolver(of => Radio)
export class RadioResolver {

    constructor(
        private radioService: RadioService,
        private songService: SongService
    ) {}

    @Span("RadioResolver/query/radios")
    @Query(returns => [Radio])
    radios() {
        return this.radioService.findAll()
    }

    @Span("RadioResolver/query/radioById")
    @Query(returns => Radio)
    radioById(@Args('id') id: string) {
        return this.radioService.findById(id)
    }

    @Span("RadioResolver/field/songs")
    @ResolveField()
    songs(@Parent() genre: Genre) {
        return this.songService.findByGenreId(genre.id)
    }
    
}