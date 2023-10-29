import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ArtistModel } from "../model/artist.model";
import { MusicLibraryCLient } from "../../shared/client/music-library.client";

@Injectable()
export class ArtistService {

  constructor(private client: MusicLibraryCLient) { }

  findById(id: string): Observable<ArtistModel[]> {
    return this.client.get(`artists/${id}`)
  }

  findAll() {
    return this.client.get(`artists`)
  }

}