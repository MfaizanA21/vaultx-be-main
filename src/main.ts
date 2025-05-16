import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('VaultX API')
    .setDescription('The VaultX API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
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
