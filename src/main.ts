import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@core/exception-handlers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Set ApI prefix
  app.setGlobalPrefix('/api/');

  // Set API Default Version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  function enableSwagger(app) {
    const config = new DocumentBuilder()
      .setTitle('Task Manegement API Documentation')
      .setDescription('API docs')
      .setVersion('1.0')
      .addServer(configService.get('APP_URL'), 'current')
      .addBearerAuth({
        type: 'apiKey',
        scheme: 'Bearer',
        name: 'authorization',
        in: 'header',
      })
      .addTag('Task Manegement Api')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    });
  }
  enableSwagger(app);
  await app.listen(configService.get<number>('APP_PORT'));
}

bootstrap();
