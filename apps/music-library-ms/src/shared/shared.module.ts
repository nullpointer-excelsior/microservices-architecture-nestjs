import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[
        ConfigModule.forRoot(),
        DatabaseModule.register({
            host: process.env.MUSIC_LIBRARY_MS_DATABASE_HOST,
            port: +process.env.MUSIC_LIBRARY_MS_DATABASE_PORT,
            username: process.env.MUSIC_LIBRARY_MS_DATABASE_USER,
            password: process.env.MUSIC_LIBRARY_MS_DATABASE_PASS,
            database: process.env.MUSIC_LIBRARY_MS_DATABASE_NAME,
          }),
    ],
    exports:[
        SharedModule
    ]
})
export class SharedModule {}
