import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        BASEURL: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development')
          .required(),
        SWAGGER_DOC_TITLE: Joi.string().default('API Documentation'),
        SWAGGER_DOC_DESCRIPTION: Joi.string().default('API Description'),
        SWAGGER_DOC_VERSION: Joi.string().default('1.0'),
        SWAGGER_PATH: Joi.string().default('documentation'),
        SWAGGER_SITE_TITLE: Joi.string().default('API Docs'),
        SWAGGER_MODELS_EXPAND_DEPTH: Joi.number().default(-1),
      }),
      load: [
        () => ({
          swagger: {
            docTitle: process.env.SWAGGER_DOC_TITLE,
            docDescription: process.env.SWAGGER_DOC_DESCRIPTION,
            docVersion: process.env.SWAGGER_DOC_VERSION,
            path: process.env.SWAGGER_PATH,
            siteTitle: process.env.SWAGGER_SITE_TITLE,
            defaultModelsExpandDepth: parseInt(process.env.SWAGGER_MODELS_EXPAND_DEPTH, 10),
          },
        }),
      ],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
