import { NestFactory } from '@nestjs/core';
import { MailingMsModule } from './mailing-ms.module';
import { RabbitmqQueueModule } from '../../../libs/rabbitmq-queue/rabbitmq-queue.module';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { startOpenTelemetry } from '../../../libs/shared/src/instrumentation/opentelemetry/start-opentelemetry';

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
