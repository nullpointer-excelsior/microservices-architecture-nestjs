import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

const APP_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

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
      process.exit();
    });
  };

  process.on('SIGINT', handleTermination);
  process.on('SIGTERM', handleTermination);
}
bootstrap();
