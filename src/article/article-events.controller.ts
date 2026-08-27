import { Controller,Sse } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import type { Observable } from 'rxjs';

import { ArticleService } from './article.service';

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