import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('PORT') || 3000;

  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  await app.listen(port);
  // await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
