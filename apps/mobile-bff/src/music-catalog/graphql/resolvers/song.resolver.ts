/* eslint-disable @typescript-eslint/no-unused-vars */
import { MusicCatalogClient } from "@lib/music-library-grpc";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Span } from "nestjs-otel";
import { Song } from "../models/song.model";
@Resolver(of => Song)
export class SongResolver {
    
    constructor(private grpc: MusicCatalogClient) {}

    @Span("SongResolver/query/songById")
    @Query(returns => Song)
    songById(@Args('id') id: string) {
        return this.grpc.findSongById(id)
    }


}