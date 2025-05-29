import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.GATEWAY_PORT || 4000;
  await app.listen(port);
  console.log(`Gateway service is running on port ${port}`);
}
bootstrap();
