import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import envConfig from '../env';
import { EventEmitter } from 'events';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: `${envConfig.routerPrefix}/public/`,
  });

  if (process.env.NODE_ENV === 'production') {
    app.useStaticAssets(join(__dirname, '../../', 'assets/dist'), {
      prefix: `${envConfig.routerPrefix}/assets/dist/`,
    });
  }

  app.setBaseViewsDir(join(__dirname, '..', 'view'));
  app.setViewEngine('ejs');

  EventEmitter.defaultMaxListeners = Infinity;

  await app.listen(3000);
}
bootstrap();
