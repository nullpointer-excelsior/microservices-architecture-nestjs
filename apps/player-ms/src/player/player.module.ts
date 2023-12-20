import { Module } from '@nestjs/common';
import { MusicLibraryApiModule } from '../../../../libs/music-library-api/src';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlayerService } from './services/player.service';
import { PlayerController } from './controllers/player.controller';
import { S3Module } from '../s3/s3.module';

export const MUSIC_CATALOG_BUCKET = 'MUSIC_CATALOG_BUCKET'

@Module({
    imports: [
        ConfigModule.forRoot(),
        MusicLibraryApiModule.forAsyncRoot({
            useFactory(config: ConfigService) {
                console.log('player-module', config)
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
        PlayerService,
        {
            provide: 'MUSIC_CATALOG_BUCKET',
            useFactory(config: ConfigService) {
                console.log('config-value', config.get('MUSIC_LIBRARY_BUCKET_NAME'))
                return config.get('MUSIC_LIBRARY_BUCKET_NAME')
            },
            inject: [ConfigService],
        }
    ],
    controllers: [
        PlayerController
    ]
})
export class PlayerModule { }
