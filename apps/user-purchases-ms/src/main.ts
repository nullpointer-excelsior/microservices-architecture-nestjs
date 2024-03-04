import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getUserPurchaseMicroserviceOptions } from '@lib/distributed-transactions/user-purchases';
import { UserPurchasesMsModule } from './user-purchases-ms.module';

async function bootstrap() {

  const app = await NestFactory.create(UserPurchasesMsModule);
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice(getUserPurchaseMicroserviceOptions())
  app.startAllMicroservices()

  const config = new DocumentBuilder()
    .setTitle('User purchases microservice')
    .setDescription('User purchase process microservice based on saga pattern.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.USER_PURCHASES_MS_APP_PORT

  await app.listen(port, () => {
    Logger.log(`User purchases microservice listen on port: ${port}`, "Main")
    Logger.log(`Docs available on http://localhost:${port}/api`, "Main")
  });

}
bootstrap();
