import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import type { Response } from 'express'; 
import { ArtistService } from 'src/artist/artist.service';
import { UserService } from 'src/user/user.service';
import { ArticleType } from './entities/article-type.enum';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService, private readonly userService: UserService, private readonly artistService: ArtistService) {}

  @Get()
  @Render('articles/list')
  async findAll() {
    const articles =
      await this.articleService.findAll();

    const articleItems = articles.map((article) => ({...article, typeLabel: this.getTypeLabel(article.type)}));
    return {
      articles: articleItems
    };
  }

  private getTypeLabel(type: ArticleType){
    switch (type){
      case ArticleType.NEWS:
        return 'Новость';

      case ArticleType.REVIEW: return 'Обзор';

      case ArticleType.CONCERT_ANNOUNCEMENT: return 'Анонс концерта';
    }
  }

  private getBackUrl(type: ArticleType) {
    switch (type) {
      case ArticleType.NEWS:
        return '/';

      case ArticleType.REVIEW:
        return '/reviews';

      case ArticleType.CONCERT_ANNOUNCEMENT:
        return '/events';
    }
  }

  @Get('add')
  @Render('articles/add')
  async showAddForm() {
    const users =
      await this.userService.findAll();

    const artists =
      await this.artistService.findAll();

    const typeOptions = [
      {
        value: ArticleType.NEWS,
        label: 'Новость',
      },
      {
        value: ArticleType.REVIEW,
        label: 'Обзор',
      },
      {
        value: ArticleType.CONCERT_ANNOUNCEMENT,
        label: 'Анонс концерта',
      },
    ];

    return {
      users,
      artists,
      typeOptions,
    };
  }

  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Res() res: Response,
  ) {
    const article =
      await this.articleService.create(
        createArticleDto,
      );

    return res.redirect(
      `/articles/${article.id}`,
    );
  }

  @Get(':id/edit')
  @Render('articles/edit')
  async editForm(
    @Param('id') id: string,
  ) {
    const article =
      await this.articleService.findOne(+id);

    const users =
      await this.userService.findAll();

    const artists =
      await this.artistService.findAll();

    const userOptions = users.map((user) => ({
      id: user.id,
      name: user.name,
      selected:
        article.author.id === user.id,
    }));

    const artistOptions = artists.map(
      (artist) => ({
        id: artist.id,
        stageName: artist.stageName,
        selected:
          article.artist?.id === artist.id,
      }),
    );

    const typeOptions = [
      {
        value: ArticleType.NEWS,
        label: 'Новость',
        selected:
          article.type === ArticleType.NEWS,
      },
      {
        value: ArticleType.REVIEW,
        label: 'Обзор',
        selected:
          article.type === ArticleType.REVIEW,
      },
      {
        value:
          ArticleType.CONCERT_ANNOUNCEMENT,
        label: 'Анонс концерта',
        selected:
          article.type ===
          ArticleType.CONCERT_ANNOUNCEMENT,
      },
    ];

    
    return {
      article,
      userOptions,
      artistOptions,
      typeOptions,
    };
  }

  @Get(':id')
  @Render('articles/details')
  async findOne(
    @Param('id') id: string,
  ) {
    const article =
      await this.articleService.findOne(+id);

    return {
      article,
      typeLabel: this.getTypeLabel(article.type),
      backUrl: this.getBackUrl(article.type),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Res() res: Response,
  ) {
    await this.articleService.update(
      +id,
      updateArticleDto,
    );

    return res.redirect(
      `/articles/${id}`,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.articleService.remove(+id);

    return res.redirect('/articles');
  }
}
