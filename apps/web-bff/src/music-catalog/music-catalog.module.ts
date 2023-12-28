import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MusicLibraryApiModule } from "@lib/music-library-api";
import { HomeLibraryController } from "./restful/controllers/catalog.controller";
import { CatalogService } from "./restful/services/catalog.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MusicLibraryApiModule.forAsyncRoot({
            useFactory(config: ConfigService) {
                return {
                    url: config.get('MUSIC_LIBRARY_API')
                }
            },
            imports: [ConfigModule],
            inject: [ConfigService]
        }),
    ],
    providers:[
        CatalogService,
        {
            provide: 'MEDIA_SERVER_URL',
            useFactory(config: ConfigService) {
                return config.get('WEB_BFF_MEDIA_SERVER')
            },
            inject: [ConfigService]
        }
    ],
    controllers: [
        HomeLibraryController
    ]
})
export class MusicCatalogModule { }