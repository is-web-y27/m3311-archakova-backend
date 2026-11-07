import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('about')
  @Render('about')
  about(@Query('user') user?: string) {
    return { user };
  }

  @Get('api-posts')
  @Render('api-posts')
  apiPosts(@Query('user') user?: string) {
    return { user };
  }
}
