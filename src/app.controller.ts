import { Controller, Get, Render } from '@nestjs/common';
import { PublicAccess } from './infrastructure/auth/decorators/public-access.decorator';

@PublicAccess()
@Controller()
export class AppController {
  @Get('about')
  @Render('about')
  about() {
    return {};
  }

  @Get('api-posts')
  @Render('api-posts')
  apiPosts() {
    return {};
  }
}
