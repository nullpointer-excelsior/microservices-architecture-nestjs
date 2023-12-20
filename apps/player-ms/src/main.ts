import { NestFactory } from '@nestjs/core';
import { PlayerMsModule } from './player-ms.module';
import { Logger } from '@nestjs/common';
import { startOpenTelemetry } from '@lib/shared/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

async function bootstrap() {
  const app = await NestFactory.create(PlayerMsModule);
  
  const port = +process.env.PLAYER_MS_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Player microservice ready on http://localhost:${port}/graphql`, "Main")
  });
}

startOpenTelemetry({
  serviceName: "player-ms",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
})

bootstrap();
