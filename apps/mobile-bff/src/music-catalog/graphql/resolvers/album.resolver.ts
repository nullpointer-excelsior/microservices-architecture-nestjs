/* eslint-disable @typescript-eslint/no-unused-vars */
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Span } from "nestjs-otel";
import { toArray } from "rxjs";
import { MusicCatalogClient } from "../../../../../../libs/music-library-grpc/src";
import { Album } from "../models/album.model";

@Resolver(of => Album)
export class AlbumResolver {
    
    constructor(private grpc: MusicCatalogClient) {}

    @Span("AlbumResolver/field/song")
    @ResolveField()
    songs(@Parent() album: Album) {
        return this.grpc.findSongsByAlbumId(album.id).pipe(toArray())
    }

}