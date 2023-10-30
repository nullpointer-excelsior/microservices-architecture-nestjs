/* eslint-disable @typescript-eslint/no-unused-vars */
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Album } from "../models/album.model";
import { SongService } from "../../music-library-api/services/song.service";
import { Span } from "nestjs-otel";

@Resolver(of => Album)
export class AlbumResolver {
    
    constructor(private songService: SongService) {}

    @Span("AlbumResolver/field/song")
    @ResolveField()
    songs(@Parent() album: Album) {
        return this.songService.findByAlbumId(album.id)
    }

}