import { NestFactory } from '@nestjs/core';
import { MobileBffModule } from './mobile-bff.module';
import { Logger } from '@nestjs/common';
import { startOpenTelemetry } from '../../../libs/shared/src/instrumentation/opentelemetry/start-opentelemetry';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

async function bootstrap() {
  
  const app = await NestFactory.create(MobileBffModule);
  const port = +process.env.MOBILE_BFF_APP_PORT

  await app.listen(port, () => {
    Logger.log(`Mobile BFF listen on port: ${port}`, "Main")
  });
  
}

startOpenTelemetry({
  serviceName: "mobile-bff",
  serviceVersion: "1.0",
  metricExporterOptions: {
    url: process.env.OTLP_TRACE_EXPORTER_URL,
  },
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
    }),
  ],
})

bootstrap();
