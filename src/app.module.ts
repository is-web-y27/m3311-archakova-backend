import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormConfService } from './infrastructure/database/typeorm_conf.service';
import { MusicLabelModule } from './music-label/music-label.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { LabelStatModule } from './label-stat/label-stat.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeormConfService,
    }),
    MusicLabelModule,
    UserModule,
    ArtistModule,
    LabelStatModule,
    FeedbackModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
