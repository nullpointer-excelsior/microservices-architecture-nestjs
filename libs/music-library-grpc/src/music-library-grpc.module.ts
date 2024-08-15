import { DynamicModule, Module } from '@nestjs/common';
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
export class MusicLibraryGrpcModule {

  static forRoot(props: { url: string }): DynamicModule {
    return {
      module: MusicLibraryGrpcModule,
      imports: [
        ClientsModule.register([
          {
            name: 'MUSIC_CATALOG_PACKAGE',
            transport: Transport.GRPC,
            options: {
              url: props.url,
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
    }
  }
}
