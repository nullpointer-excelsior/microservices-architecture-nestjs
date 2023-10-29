import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig } from "axios";
import { Observable, map } from "rxjs";

@Injectable()
export class MusicLibraryCLient {

    private musiclibraryUrl = null

    constructor(
        private readonly http: HttpService, 
        private readonly config: ConfigService
    ) { 
        this.musiclibraryUrl = this.config.get("MOBILE_BFF_MUSIC_LIBRARY_API")
    }

    get<T = any>(endopoint: string, config?: AxiosRequestConfig): Observable<T> {
        const url = `${this.musiclibraryUrl}/${endopoint}`
        return this.http.get(url, config).pipe(
            map(res => res.data)
        );
    }

}