/* eslint-disable @typescript-eslint/no-unused-vars */
import { RadioAPI } from "@lib/music-discovery-api";
import { MusicCatalogClient } from "@lib/music-library-grpc";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { toArray } from "rxjs";
import { Radio } from "../models/radio.model";

@Resolver(of => Radio)
export class RadioResolver {

    constructor(
        private radioAPI: RadioAPI,
        private grpc: MusicCatalogClient
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
        return this.grpc.findSongsByIds(songIds).pipe(toArray())
    }

}