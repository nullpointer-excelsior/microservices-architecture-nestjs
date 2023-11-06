import { NestFactory } from '@nestjs/core';
import { PlayerMsModule } from './player-ms.module';
import { Logger } from '@nestjs/common';
import { RabbitmqQueueModule } from '../../../libs/rabbitmq-queue/rabbitmq-queue.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(PlayerMsModule);
  
  const config = new DocumentBuilder()
  .setTitle('Player microservice API')
  .setDescription('The Spotify player API description')
  .setVersion('1.0')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = +process.env.PLAYER_MS_APP_PORT
  
  app.connectMicroservice(RabbitmqQueueModule.getMicroserviceOptions())
  await app.startAllMicroservices()
  
  app.listen(port, () => {
    Logger.log(`Player microservice listen on port: ${port}`, "Main")
    Logger.log(`RabbitMQ Manager on http://localhost:15672/`, "Main")
  }); 

}
bootstrap();
