import { Controller,Sse } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import type { Observable } from 'rxjs';

import { ArticleService } from './article.service';
import { PublicAccess } from '../infrastructure/auth/decorators/public-access.decorator';

@PublicAccess()
@Controller('article-events')
export class ArticleEventsController {
  constructor(
    private readonly articleService: ArticleService,
  ) {}

  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.articleService.getUpdates();
  }
}
