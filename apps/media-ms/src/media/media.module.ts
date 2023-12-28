import { Module } from '@nestjs/common';
import { MusicLibraryApiModule } from '../../../../libs/music-library-api/src';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AudioService } from './services/audio.service';
import { AudioController } from './controllers/audio.controller';
import { S3Module } from '../s3/s3.module';
import { CoverController } from './controllers/cover.controller';
import { CoverService } from './services/cover.service';

export const MUSIC_CATALOG_BUCKET = 'MUSIC_CATALOG_BUCKET'

@Module({
    imports: [
        ConfigModule.forRoot(),
        MusicLibraryApiModule.forAsyncRoot({
            useFactory(config: ConfigService) {
                return {
                    url: config.get('MOBILE_BFF_MUSIC_LIBRARY_API')
                }
            },
            imports: [ConfigModule],
            inject: [ConfigService]
        }),
        S3Module
    ],
    providers: [
        AudioService,
        CoverService,
        {
            provide: 'MUSIC_CATALOG_BUCKET',
            useFactory(config: ConfigService) {
                return config.get('MUSIC_LIBRARY_BUCKET_NAME')
            },
            inject: [ConfigService],
        }
    ],
    controllers: [
        AudioController,
        CoverController
    ]
})
export class MediaModule { }
