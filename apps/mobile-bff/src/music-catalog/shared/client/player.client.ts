import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig } from "axios";
import { Span } from "nestjs-otel";
import { Observable, map } from "rxjs";

@Injectable()
export class PlayerCLient {

    private playerUrl = null

    constructor(
        private readonly http: HttpService, 
        private readonly config: ConfigService
    ) { 
        this.playerUrl = this.config.get("MOBILE_BFF_PLAYER_API")
    }

    @Span("PlayerHttpClient/GET")
    get<T = any>(endopoint: string, config?: AxiosRequestConfig): Observable<T> {
        const url = `${this.playerUrl}/${endopoint}`
        return this.http.get(url, config).pipe(
            map(res => res.data)
        );
    }

}