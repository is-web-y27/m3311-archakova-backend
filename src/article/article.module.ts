import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ArtistModule } from 'src/artist/artist.module';
import { Article } from './entities/article.entity';
import { ArticlePagesController } from './article-pages.controller';
import { ArticleEventsController } from './article-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UserModule, ArtistModule],
  controllers: [ArticleController, ArticlePagesController, ArticleEventsController],
  providers: [ArticleService],
  exports: [ArticleService]
})
export class ArticleModule {}
