import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, isAxiosError } from "axios";
import { Span } from "nestjs-otel";
import { Observable, catchError, map } from "rxjs";
import { HttpClientError } from "./http-client.error";

@Injectable()
export class MusicDiscoveryCLient {

    constructor(private readonly http: HttpService) { }

    @Span("MusicDiscoveryHttpClient/GET")
    get<T = any>(endopoint: string, config?: AxiosRequestConfig): Observable<T> {
        const url = `/${endopoint}`
        return this.http.get<T>(url, config).pipe(
            map(res => res.data),
            catchError((error) => {
                if (isAxiosError(error)) {
                    throw new HttpClientError({ 
                        message: error.message,
                        status: error.response?.status || 500,
                        url: error.config.url || "",
                        response: error.response?.data || 'Unknow error',
                     })
                }
                throw error
            })
        );
    }

}