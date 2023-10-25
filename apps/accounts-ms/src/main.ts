import { NestFactory } from '@nestjs/core';
import { AccountsMsModule } from './accounts-ms.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';


async function bootstrap() {

  const app = await NestFactory.create(AccountsMsModule);

  const config = new DocumentBuilder()
    .setTitle('Accounts microservice API')
    .setDescription('The Spotify accounts API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.ACCOUNTS_MS_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Accounts microservice listen on port: ${port}`, "Main")
  });

}


bootstrap();
