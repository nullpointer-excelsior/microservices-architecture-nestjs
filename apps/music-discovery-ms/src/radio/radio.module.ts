import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RadioUseCases } from './application/radio.use-cases';
import { RadioRepository } from './domain/repositories/radio.repository';
import { MongoRadioRepository } from './infrastructure/mongo/repositories/mongo-radio.repository';
import { RadioDocument, RadioSchema } from './infrastructure/mongo/schemas/radio.schema';
import { SongDocument, SongSchema } from './infrastructure/mongo/schemas/song.schema';
import { RadioController } from './infrastructure/restful/radio.controller';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [
                ConfigModule.forRoot()
            ],
            useFactory: (config: ConfigService) => {
                const user = config.get('MUSIC_DISCOVERY_MS_DATABASE_USER')
                const password = config.get('MUSIC_DISCOVERY_MS_DATABASE_PASS')
                const host = config.get('MUSIC_DISCOVERY_MS_DATABASE_HOST')
                const port = config.get('MUSIC_DISCOVERY_MS_DATABASE_PORT')
                const name = config.get('MUSIC_DISCOVERY_MS_DATABASE_NAME')
                const uri = `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`
                return {
                    uri: uri
                }
            },
            inject: [
                ConfigService
            ]
        }),
        MongooseModule.forFeature([
            { name: RadioDocument.name, schema: RadioSchema },
            { name: SongDocument.name, schema: SongSchema },
        ]),

    ],
    controllers: [
        RadioController
    ],
    providers: [
        RadioUseCases,
        MongoRadioRepository,
        {
            provide: RadioRepository,
            useExisting: MongoRadioRepository
        }
    ]
})
export class RadioModule { }
