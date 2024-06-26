import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EventsModule } from './events.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(EventsModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(4002);
}
bootstrap();
