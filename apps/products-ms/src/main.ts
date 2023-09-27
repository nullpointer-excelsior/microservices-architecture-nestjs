import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { InstrumentationModule } from '../../../libs/shared/src/instrumentation/instrumentation.module';

const APP_PORT = 3000;

async function bootstrap() {
  
  const sdk = InstrumentationModule.createSdk({
    serviceName:"products-ms",
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
  
  const app = await NestFactory.create(ProductsModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  app.enableShutdownHooks();
  const server = await app.listen(APP_PORT);

  logger.log(`Env:${process.env.NODE_ENV}`);
  logger.log(`Application is running on: ${await app.getUrl()}`);

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
