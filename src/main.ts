import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './appModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  configureSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');

  await app.listen(port);
}

function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('CQRS Demo')
    .setDescription('CQRS Demo Project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
