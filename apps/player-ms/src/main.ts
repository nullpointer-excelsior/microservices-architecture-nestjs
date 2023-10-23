import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PlayerMsModule } from './player-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(PlayerMsModule);

  const config = new DocumentBuilder()
    .setTitle('Player microservice API')
    .setDescription('The Spotify player API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
