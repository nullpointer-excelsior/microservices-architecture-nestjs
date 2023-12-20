import { Module } from '@nestjs/common';
import { StorageCLient } from './client/storage.client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
    imports: [
        ConfigModule.forRoot()
    ],
    providers: [
        StorageCLient,
        {
            provide: S3Client,
            useFactory(config: ConfigService) {
                return new S3Client({
                    endpoint: config.get('MINIO_ENDPOINT').replace('localhost', '127.0.01'),
                    credentials: {
                        accessKeyId: config.get('MINIO_ACCESS_KEY'),
                        secretAccessKey: config.get('MINIO_SECRET_KEY'),
                    }
                });
            },
            inject: [ConfigService]
        }
    ],
    exports: [
        StorageCLient
    ]
})
export class S3Module {

}
