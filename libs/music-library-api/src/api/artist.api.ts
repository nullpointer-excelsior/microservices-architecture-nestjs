import { HttpClient } from "@lib/utils/http-client";
import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { Artist } from "../model/artist.model";

@Injectable()
export class ArtistAPI {

  constructor(private client: HttpClient) { }

  @Span("ArtistAPI/findById")
  findById(id: string) {
    return this.client.get<Artist>(`artists/${id}`)
  }

  @Span("ArtistAPI/findAll")
  findAll() {
    return this.client.get<Artist[]>(`artists`)
  }

}