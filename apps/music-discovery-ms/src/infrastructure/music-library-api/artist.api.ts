import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map } from "rxjs";

@Injectable()
export class ArtistApi {

    private url: string

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ) {
        this.url = this.config.get("MOBILE_BFF_MUSIC_LIBRARY_API")
    }

    findById(id: string) {
        return this.http.get(`${this.url}/artists/${id}`).pipe(
            map(res => res.data)
        )
    }

}