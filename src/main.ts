import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';
import hbs from 'hbs';
import methodOverride from 'method-override';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(methodOverride('_method'));
  const configService = app.get(ConfigService);

  const port = Number(configService.get<string>('PORT')) || 3000;

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..', 'views/partials'));

  hbs.registerHelper(
  'formatDate',
  (value: Date | string) => {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('ru-RU');
  },
);

  await app.listen(port, '0.0.0.0'
  );
  // await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
