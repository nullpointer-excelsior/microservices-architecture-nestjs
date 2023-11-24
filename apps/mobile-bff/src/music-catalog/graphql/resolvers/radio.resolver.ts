/* eslint-disable @typescript-eslint/no-unused-vars */
import { RadioAPI } from "@lib/music-discovery-api";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Radio } from "../models/radio.model";
import { SongAPI } from "@lib/music-library-api";

@Resolver(of => Radio)
export class RadioResolver {

    constructor(
        private radioAPI: RadioAPI,
        private songAPI: SongAPI
    ) {}

    @Query(returns => Radio)
    radioById(@Args('id') id: string) {
        return this.radioAPI.findById(id)
    }

    @Query(returns => [Radio])
    radios() {
        return this.radioAPI.findAll()
    }

    @ResolveField()
    songs(@Parent() radio: Radio) {
        const songIds = radio.songs.map(song => song.id) 
        return this.songAPI.findByIdIn(songIds)
    }

}