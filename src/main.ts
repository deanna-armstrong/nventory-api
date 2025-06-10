import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // strips properties not in the DTO
    forbidNonWhitelisted: true, // throws if unknown properties are present
    transform: true,       // auto-transforms payloads to match DTO types
  }));

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://nventory-ui.vercel.app',
      'https://nventory-2gj3p6sk6-deanna-armstrongs-projects.vercel.app'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
