import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown fields automatically
      forbidNonWhitelisted: true, // throw error on unexpected fields
      transform: true, // converts payloads to DTO classes
    })
  );
  await app.listen(process.env.APP_PORT || "0.0.0.0");
}
bootstrap();
