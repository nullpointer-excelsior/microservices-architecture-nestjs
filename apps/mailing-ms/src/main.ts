import { getRabbitMQOptions } from '@lib/integration-events';
import { startOpenTelemetry } from '@lib/shared/instrumentation';
import { NestFactory } from '@nestjs/core';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MailingMsModule } from './mailing-ms.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    MailingMsModule,
    getRabbitMQOptions()
  );
  await app.listen();
}

startOpenTelemetry({
  serviceName: "mailing-ms",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
    }),
  ],
})

bootstrap();
