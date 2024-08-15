import { NestFactory } from '@nestjs/core';
import { SpotifyMonolithModule } from './spotify-monolith.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(SpotifyMonolithModule);

  const config = new DocumentBuilder()
    .setTitle('Spotify Clone Monolith')
    .setDescription('The Spotify Clone API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.SPOTIFY_MONOLITH_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Spotify monolith listen on port: ${port}`, "Main")
    Logger.log(JSON.stringify(process.env), "Main")
  });

}
bootstrap();
