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
                        accessKeyId: config.get('MINIO_ROOT_USER'),
                        secretAccessKey: config.get('MINIO_ROOT_PASSWORD'),
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
