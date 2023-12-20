import { NestFactory } from '@nestjs/core';
import { MailingMsModule } from './mailing-ms.module';
import { RabbitmqQueueModule } from '@lib/rabbitmq-queue';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { startOpenTelemetry } from '@lib/shared/instrumentation';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    MailingMsModule,
    RabbitmqQueueModule.getMicroserviceOptions()
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
