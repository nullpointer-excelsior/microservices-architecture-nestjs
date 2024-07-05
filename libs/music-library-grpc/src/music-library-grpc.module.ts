import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MusicCatalogClient } from './music-catalog.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MUSIC_CATALOG_PACKAGE',
        transport: Transport.GRPC,
        options: {
          // url: "music-library-ms:5000",
          url: process.env.GRPC_MUSIC_LIBRARY_URL,
          package: 'catalog',
          protoPath: join(__dirname, 'music-catalog.proto'),
        },
      },
    ]),
  ],
  providers: [
    MusicCatalogClient
  ],
  exports: [
    MusicCatalogClient
  ]
  
})
export class MusicLibraryGrpcModule {}
