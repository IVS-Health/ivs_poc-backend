import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5174',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown fields automatically
      forbidNonWhitelisted: true, // throw error on unexpected fields
      transform: true, // converts payloads to DTO classes
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
