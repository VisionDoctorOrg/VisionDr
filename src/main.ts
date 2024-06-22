import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config';
// import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/');
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('BASE_URL') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Setup Swagger
  setupSwagger(app);

  const logger = new Logger('bootstrap');

  await app.listen(configService.get('PORT'), () => {
    return logger.log(`🚀 Server running on port ${configService.get('PORT')}`);
  });

}
bootstrap();
