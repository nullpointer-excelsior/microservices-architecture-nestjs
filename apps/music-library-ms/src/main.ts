import { NestFactory } from '@nestjs/core';
import { MusicLibraryMsModule } from './music-library-ms.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(MusicLibraryMsModule);

  const config = new DocumentBuilder()
    .setTitle('Music library microservice')
    .setDescription('The Music library API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

}
bootstrap();
