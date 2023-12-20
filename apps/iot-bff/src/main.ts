import { NestFactory } from '@nestjs/core';
import { IotBffModule } from './iot-bff.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MusicCatalogClient } from '@lib/music-library-grpc';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(IotBffModule, {
    transport: Transport.GRPC,
    options: {
      package: 'catalog',
      protoPath: join(__dirname, 'music-catalog.proto'),
    },
  });
  
  await app.listen()

  const s = app.get<MusicCatalogClient>(MusicCatalogClient)
  s.findAllArtists().subscribe(a => console.log('result', a))

}
bootstrap();
