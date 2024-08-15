import { NestFactory } from '@nestjs/core';
import { MediaMsModule } from './media-ms.module';
import { Logger } from '@nestjs/common';
import { startOpenTelemetry } from '@lib/shared/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

async function bootstrap() {
  const app = await NestFactory.create(MediaMsModule);
  
  const port = +process.env.MEDIA_MS_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Media microservice ready on http://localhost:${port}`, "Main")
    Logger.log(JSON.stringify(process.env), "Main")
  });
}

startOpenTelemetry({
  serviceName: "media-ms",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
})

bootstrap();
