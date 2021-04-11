import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpEnvironment } from './env-config/entity/http-environment';
import { EnvConfigService } from './env-config/env-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpEnvironment = app
    .get(EnvConfigService)
    .get<HttpEnvironment>('http');

  app.use(cookieParser());

  await app.listen(httpEnvironment?.port ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
