import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/');
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('BASE_URLS')?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 1000 * 60 * 60,
      max: 1000, // 1000 requests por windowMs
      message:
        '⚠️  Too many request created from this IP, please try again after an hour',
    }),
  );

  //app.use(cookieParser());

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
bootstrap().catch((e) => {
  Logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap', false);
  throw e;
});
