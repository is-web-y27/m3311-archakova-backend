import { Controller, Get, Render } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleType } from './entities/article-type.enum';
import { PublicAccess } from '../infrastructure/auth/decorators/public-access.decorator';

@PublicAccess()
@Controller()
export class ArticlePagesController {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @Render('index')
  async showNews() {
    const articles =
      await this.articleService.findByType(
        ArticleType.NEWS,
      );

    return {
      articles,
    };
  }

  @Get('reviews')
  @Render('reviews')
  async showReviews() {
    const articles =
      await this.articleService.findByType(
        ArticleType.REVIEW,
      );

    return {
      articles,
    };
  }

  @Get('events')
  @Render('events')
  async showEvents() {
    const articles =
      await this.articleService.findByType(
        ArticleType.CONCERT_ANNOUNCEMENT,
      );

    return {
      articles,
    };
  }
}
