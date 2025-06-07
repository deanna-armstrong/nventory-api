import { NestFactory } from '@nestjs/core';
import { AppModule }   from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:4200', // local Angular
    'https://nventory-ui.vercel.app',                              
    'https://nventory-2gj3p6sk6-deanna-armstrongs-projects.vercel.app' 
  ];

  app.setGlobalPrefix('api');
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS forbidden for origin ${origin}`), false);
      }
    },
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','Accept'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
