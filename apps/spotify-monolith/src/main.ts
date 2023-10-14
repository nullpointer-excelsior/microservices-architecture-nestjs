import { NestFactory } from '@nestjs/core';
import { SpotifyMonolithModule } from './spotify-monolith.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(SpotifyMonolithModule);

  const config = new DocumentBuilder()
    .setTitle('Spotify Clone Monolith')
    .setDescription('The Spotify Clone API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();
