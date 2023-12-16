import { Module } from '@nestjs/common';
import { HttpClient } from './client/http-client';
import { HttpModule, HttpModuleAsyncOptions } from '@nestjs/axios';

@Module({
})
export class HttpClientModule {

    static registerAsync(options: HttpModuleAsyncOptions) {
        return {
            module: HttpClientModule,
            imports: [
                HttpModule.registerAsync(options)
            ],
            providers: [
                HttpClient
            ],
            exports: [
                HttpClient
            ]
        }
    }
}
