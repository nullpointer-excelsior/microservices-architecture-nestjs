import { startOpenTelemetry } from '@lib/shared/instrumentation';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { WebBffModule } from './web-bff.module';

async function bootstrap() {
  
  const app = await NestFactory.create(WebBffModule);
  app.enableCors();
  
  const port = +process.env.WEB_BFF_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Web BFF ready on http://localhost:${port}`, "Main")
    Logger.log(JSON.stringify(process.env), "Main")
  });
  
}

startOpenTelemetry({
  serviceName: "web-bff",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
    }),
  ],
})

bootstrap();
