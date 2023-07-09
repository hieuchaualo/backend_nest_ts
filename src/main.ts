import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './apps/app.module';
import appConfig from 'src/config/appConfig';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './common/filters';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // WARN: Chrome does support cross-origin requests from localhost.
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || appConfig.crosOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error(`${origin} has been blocked by CORS policy.`), false)
      }
    },
  });
  app.use(helmet({
    crossOriginResourcePolicy: false,
  }));
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // if you need prefix
  // app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NestJS Server')
    .setDescription('The API documentation')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(appConfig.port);
  console.log(`App's running on port ${appConfig.port}`);
}
bootstrap();
