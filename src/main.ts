// src/main.ts

import { NestFactory } from '@nestjs/core';
// NestFactory is used to create the Nest application instance

import { AppModule } from './app.module';
// AppModule is the root module that aggregates all feature modules

import { ValidationPipe } from '@nestjs/common';
// ValidationPipe enforces DTO validation rules globally

async function bootstrap() {
  // Create the Nest application using the root module
  const app = await NestFactory.create(AppModule);

  // Prefix all routes with '/api' (e.g., GET /api/inventory)
  app.setGlobalPrefix('api');

  // Apply global validation to all incoming requests:
  // - whitelist: strip properties without decorators
  // - forbidNonWhitelisted: reject requests containing extra props
  // - transform: auto-convert payloads to DTO instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for specific front-end origins
  app.enableCors({
    origin: [
      'http://localhost:4200', // local Angular dev
      'https://nventory-ui.vercel.app', // Vercel-deployed UI
      'https://nventory-2gj3p6sk6-deanna-armstrongs-projects.vercel.app', // alternate Vercel URL
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // allow cookies and credential headers
  });

  // Listen on the configured PORT or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
