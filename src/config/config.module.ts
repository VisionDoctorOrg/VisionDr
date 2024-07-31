import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
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
        BASEURLS: Joi.string().required(),
        SWAGGER_DOC_TITLE: Joi.string().required(),
        SWAGGER_DOC_DESCRIPTION: Joi.string().required(),
        SWAGGER_DOC_VERSION: Joi.string().required(),
        SWAGGER_PATH: Joi.string().required(),
        SWAGGER_SITE_TITLE: Joi.string().required(),
        SWAGGER_MODELS_EXPAND_DEPTH: Joi.number().required(),
        NODE_ENV: Joi.string()
          .valid('production', 'development', 'test')
          .default('development')
          .required(),
      }),
      load: [
        () => ({
          // swagger: {
          //   docTitle: process.env.SWAGGER_DOC_TITLE,
          //   docDescription:
          //     process.env.SWAGGER_DOC_DESCRIPTION,
          //   docVersion: process.env.SWAGGER_DOC_VERSION,
          //   path: process.env.SWAGGER_PATH,
          //   siteTitle: process.env.SWAGGER_SITE_TITLE,
          //   defaultModelsExpandDepth: process.env.SWAGGER_MODELS_EXPAND_DEPTH
          //     ? parseInt(process.env.SWAGGER_MODELS_EXPAND_DEPTH, 10)
          //     : -1,
          // },
        }),
      ],
      // validationOptions: {
      //   allowUnknown: false,
      //   abortEarly: true,
      // },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
//
