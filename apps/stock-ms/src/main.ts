import { NestFactory } from '@nestjs/core';
import { StockMsModule } from './stock-ms.module';
import { InstrumentationModule } from '../../../libs/shared/src/instrumentation/instrumentation.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const sdk = InstrumentationModule.createSdk({
    serviceName:"stock-ms",
    serviceVersion: "1.0",
    traceExporterOptions: {
      url: "https://otlp.nr-data.net:4318/v1/traces",
      headers: {
        ['api-key']: "549373a546da446c372324876de7d0e625d7NRAL"
      }
    },
    metricExporterOptions: {
      url: "https://otlp.nr-data.net:4318/v1/metrics",
      headers: {
        ['api-key']: "549373a546da446c372324876de7d0e625d7NRAL"
      }
    }
  })
  sdk.start()
  const app = await NestFactory.create(StockMsModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  
  app.enableShutdownHooks();
  const server = await app.listen(3001);

  process.stdin.resume();
  const handleTermination = () => {
    server.close((err) => {
      if (err) {
        process.exitCode = 1;

        logger.error('Close server on bootstrap', err);
      }

      logger.log('Safe Closing server');
      process.exit(0);
    });
  };

  process.on('SIGINT', handleTermination);
  process.on('SIGTERM', handleTermination);
}
bootstrap();
