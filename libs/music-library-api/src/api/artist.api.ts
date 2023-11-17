import { Injectable } from "@nestjs/common";
import { Artist } from "../model/artist.model";
import { Span } from "nestjs-otel";
import { MusicLibraryCLient } from "./client/music-library.client";

@Injectable()
export class ArtistAPI {

  constructor(private client: MusicLibraryCLient) { }

  @Span("ArtistAPI/findById")
  findById(id: string) {
    return this.client.get<Artist>(`artists/${id}`)
  }

  @Span("ArtistAPI/findAll")
  findAll() {
    return this.client.get<Artist[]>(`artists`)
  }

}