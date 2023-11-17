/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Radio } from "../models/radio.model";
import { Genre } from "../models/genre.model";
import { Span } from "nestjs-otel";
import { RadioAPI, SongAPI } from "../../../../../../libs/music-library-api/src";

@Resolver(of => Radio)
export class RadioResolver {

    constructor(
        private radioAPI: RadioAPI,
        private songAPI: SongAPI
    ) {}

    @Span("RadioResolver/query/radios")
    @Query(returns => [Radio])
    radios() {
        return this.radioAPI.findAll()
    }

    @Span("RadioResolver/query/radioById")
    @Query(returns => Radio)
    radioById(@Args('id') id: string) {
        return this.radioAPI.findById(id)
    }

    @Span("RadioResolver/field/songs")
    @ResolveField()
    songs(@Parent() genre: Genre) {
        return this.songAPI.findByGenreId(genre.id)
    }
    
}