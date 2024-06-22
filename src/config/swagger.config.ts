import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get('swagger');

  const config = new DocumentBuilder()
    .setTitle(swaggerConfig?.docTitle)
    .setDescription(swaggerConfig?.docDescription)
    .setVersion(swaggerConfig?.docVersion)
    .addBearerAuth()
    .build();

  const documentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, documentOptions);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: swaggerConfig?.defaultModelsExpandDepth ?? -1,
    },
    customSiteTitle: swaggerConfig?.siteTitle,
  };

  SwaggerModule.setup(swaggerConfig?.path, app, document, customOptions);
};
