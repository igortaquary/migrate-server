import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Swagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  Swagger(app);

  await app.listen(3000);
}
bootstrap();
