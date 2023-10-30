import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ArtistModel } from "../model/artist.model";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";
import { Span } from "nestjs-otel";

@Injectable()
export class ArtistService {

  constructor(private client: MusicLibraryCLient) { }

  @Span("ArtistService/findById")
  findById(id: string): Observable<ArtistModel[]> {
    return this.client.get(`artists/${id}`)
  }

  @Span("ArtistService/findAll")
  findAll() {
    return this.client.get(`artists`)
  }

}