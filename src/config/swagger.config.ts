import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../../package.json';

export const Swagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Migrate')
    .setDescription('Busca de alojamentos para calouros na cidade')
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
