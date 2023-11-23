/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Span } from "nestjs-otel";
import { SongAPI } from "@lib/music-library-api";
import { Song } from "../models/song.model";

@Resolver(of => Song)
export class SongResolver {
    
    constructor(
        private songAPI: SongAPI, 
    ) {}

    @Span("SongResolver/query/songById")
    @Query(returns => Song)
    songById(@Args('id') id: string) {
        return this.songAPI.findById(id)
    }


}