import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports:[
        ConfigModule.forRoot(),
        EventEmitterModule.forRoot(),
        DatabaseModule.register({
            host: process.env.PLAYER_MS_DATABASE_HOST,
            port: +process.env.PLAYER_MS_DATABASE_PORT,
            username: process.env.PLAYER_MS_DATABASE_USER,
            password: process.env.PLAYER_MS_DATABASE_PASS,
            database: process.env.PLAYER_MS_DATABASE_NAME,
          }),
    ],
    exports:[
        SharedModule
    ]
})
export class SharedModule {}
