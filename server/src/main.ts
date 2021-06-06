import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpEnvironment } from './env-config/entity/http-environment';
import { EnvConfigService } from './env-config/env-config.service';
import { CorsEnvironment } from './env-config/entity/cors-environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsEnvironment = app
    .get(EnvConfigService)
    .get<CorsEnvironment>('cors');
  const httpEnvironment = app
    .get(EnvConfigService)
    .get<HttpEnvironment>('http');

  app.enableCors({
    credentials: true,
    origin: corsEnvironment?.origin,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(httpEnvironment?.port ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
