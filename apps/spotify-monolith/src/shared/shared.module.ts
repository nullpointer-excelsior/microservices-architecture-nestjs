import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports:[
        ConfigModule.forRoot(),
        EventEmitterModule.forRoot(),
        DatabaseModule.register({
            host: process.env.SPOTIFY_MONOLITH_DATABASE_HOST,
            port: +process.env.SPOTIFY_MONOLITH_DATABASE_PORT,
            username: process.env.SPOTIFY_MONOLITH_DATABASE_USER,
            password: process.env.SPOTIFY_MONOLITH_DATABASE_PASS,
            database: process.env.SPOTIFY_MONOLITH_DATABASE_NAME,
          }),
    ],
    exports:[
        SharedModule
    ]
})
export class SharedModule {}
