import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map } from "rxjs";
import { Radio } from "./model/radio.model";

@Injectable()
export class RadioApi {

    private url: string

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ) {
        this.url = this.config.get("MOBILE_BFF_MUSIC_LIBRARY_API")
    }

    findAll() {
        return this.http.get<Radio[]>(`${this.url}/radios`).pipe(
            map(res => res.data)
        )
    }

    addSong(radioId: string, songId: string) {
        return this.http.put(`${this.url}/radios/${radioId}/${songId}`).pipe(
            map(res => res.data)
        )
    }

}