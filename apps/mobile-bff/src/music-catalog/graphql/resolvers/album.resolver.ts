/* eslint-disable @typescript-eslint/no-unused-vars */
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Span } from "nestjs-otel";
import { Album } from "../models/album.model";
import { SongAPI } from "../../../../../../libs/music-library-api/src";

@Resolver(of => Album)
export class AlbumResolver {
    
    constructor(private songAPI: SongAPI) {}

    @Span("AlbumResolver/field/song")
    @ResolveField()
    songs(@Parent() album: Album) {
        return this.songAPI.findByAlbumId(album.id)
    }

}