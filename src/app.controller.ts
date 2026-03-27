import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  index(@Query('user') user?: string) {
    return { user };
  }

  @Get('about')
  @Render('about')
  about(@Query('user') user?: string) {
    return { user };
  }

  @Get('events')
  @Render('events')
  events(@Query('user') user?: string) {
    return { user };
  }

  @Get('reviews')
  @Render('reviews')
  reviews(@Query('user') user?: string) {
    return { user };
  }

  @Get('stats')
  @Render('stats')
  stats(@Query('user') user?: string) {
    return { user };
  }

  @Get('feedback')
  @Render('feedback')
  feedback(@Query('user') user?: string) {
    return { user };
  }

  @Get('api-posts')
  @Render('api-posts')
  apiPosts(@Query('user') user?: string) {
    return { user };
  }
}
