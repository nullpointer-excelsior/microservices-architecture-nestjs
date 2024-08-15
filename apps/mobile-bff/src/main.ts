import { NestFactory } from '@nestjs/core';
import { MobileBffModule } from './mobile-bff.module';
import { Logger } from '@nestjs/common';
import { startOpenTelemetry } from '@lib/shared/instrumentation';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

async function bootstrap() {
  
  const app = await NestFactory.create(MobileBffModule);
  app.enableCors();
  
  const port = +process.env.MOBILE_BFF_APP_PORT
  await app.listen(port, () => {
    Logger.log(`Mobile BFF ready on http://localhost:${port}/graphql`, "Main")
    Logger.log(JSON.stringify(process.env), "Main")
  });
  
}

startOpenTelemetry({
  serviceName: "mobile-bff",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
    }),
  ],
})

bootstrap();
