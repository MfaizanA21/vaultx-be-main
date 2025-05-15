import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3008);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unexpected properties
      forbidNonWhitelisted: true, // throws error if extra fields
      transform: true, // transforms plain JSON to class instance
    }),
  );
  // app.setGlobalPrefix('api');
}
bootstrap();
