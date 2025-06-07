import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // In development, allow everything so you never hit CORS issues
    console.log('⚙️  CORS enabled for all origins (development)');
    app.enableCors({ origin: true, credentials: true });
  } else {
    // In production (on Render), only allow your Vercel frontend
    const allowedOrigins = ['https://nventory-ui.vercel.app'];
    console.log('🔒 CORS restricted to:', allowedOrigins);
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API listening on http://localhost:${port}`);
}

bootstrap();
