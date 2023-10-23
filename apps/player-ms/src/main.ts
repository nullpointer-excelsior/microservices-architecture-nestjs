import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PlayerMsModule } from './player-ms.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(PlayerMsModule);

  const config = new DocumentBuilder()
    .setTitle('Player microservice API')
    .setDescription('The Spotify player API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PLAYER_MS_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Player microservice listen on port: ${port}`, "Main")
  });

}
bootstrap();
