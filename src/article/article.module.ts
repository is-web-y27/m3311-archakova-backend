import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ArtistModule } from 'src/artist/artist.module';
import { Article } from './entities/article.entity';
import { ArticlePagesController } from './article-pages.controller';
import { ArticleEventsController } from './article-events.controller';
import { ArticleApiController } from './article-api.controller';
import { ArticleResolver } from './graphql/article.resolver';
import {CacheModule} from '@nestjs/cache-manager';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
@Module({
  imports: [TypeOrmModule.forFeature([Article]), CacheModule.register({ttl: 5000}), UserModule, ArtistModule, StorageModule],
  controllers: [ArticleController, ArticlePagesController, ArticleEventsController, ArticleApiController],
  providers: [ArticleService, ArticleResolver],
  exports: [ArticleService]
})
export class ArticleModule {}
