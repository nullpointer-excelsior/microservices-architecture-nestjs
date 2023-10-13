import { NestFactory } from '@nestjs/core';
import { SpotifyMonolithModule } from './spotify-monolith.module';

async function bootstrap() {
  const app = await NestFactory.create(SpotifyMonolithModule);
  await app.listen(3000);
}
bootstrap();
