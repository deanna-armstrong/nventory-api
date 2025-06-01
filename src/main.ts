import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  Logger.debug(`JWT_SECRET: ${configService.get('JWT_SECRET')}`);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
