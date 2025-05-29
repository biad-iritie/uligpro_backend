import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EventsModule } from './events.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(EventsModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = process.env.GATEWAY_PORT || 4002;
  await app.listen(port);
  console.log(`Events service is running on port ${port}`);
}
bootstrap();
