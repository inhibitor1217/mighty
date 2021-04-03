import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpEnvironment } from './env-config/entity/http-environment';
import { EnvConfigService } from './env-config/env-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpEnvironment = app
    .get(EnvConfigService)
    .get<HttpEnvironment>('http');

  await app.listen(httpEnvironment?.port ?? 3000);
}
bootstrap();
