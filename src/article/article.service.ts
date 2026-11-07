import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ArtistService } from 'src/artist/artist.service';
import { ArticleType } from './entities/article-type.enum';
import type { MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
@Injectable()
export class ArticleService {
  private readonly articleUpdates$ = new Subject<MessageEvent>();

  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>, private readonly userService: UserService, private readonly artistService: ArtistService) {}

    getUpdates(): Observable<MessageEvent> {
      return this.articleUpdates$.asObservable();
    }

  async create(createArticleDto: CreateArticleDto) {
    const {authorId, artistId, summary, ...articleData} = createArticleDto;

    if (!authorId) {
      throw new BadRequestException('Author is required');
    }

    const author = await this.userService.findOne(Number(authorId));

    const artist = artistId ? await this.artistService.findOne(Number(artistId)) : null;

    const article = this.articleRepository.create({...articleData, author, artist, summary: summary?.trim() ? summary : null, publishedAt: new Date()});
    const savedArticle = await this.articleRepository.save(article);
    this.articleUpdates$.next({data: {action: 'created', id: savedArticle.id, title: savedArticle.title, type: savedArticle.type}});
    return savedArticle;
  }

  findAll() {
    return this.articleRepository.find({relations: {author: true, artist: true}, order: {createdAt: 'DESC'}});
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({where: {id}, relations: {author: true, artist: true}});

    if (!article){
      throw new NotFoundException(`Article ${id} not found.`);
    }
    return article;
  }

  findByType(type: ArticleType) {
    return this.articleRepository.find({
      where: {
        type,
      },
      relations: {
        author: true,
        artist: true,
      },
      order: {
        publishedAt: 'DESC',
      },
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);

    const { authorId, artistId, summary, ...articleData} = updateArticleDto;

    Object.assign(article, articleData);
    if (authorId !== undefined) {
      if (!authorId) {
        throw new BadRequestException('Author is required');
      }
      article.author = await this.userService.findOne(Number(authorId));
    }

    if (artistId !== undefined) {
      article.artist = artistId
        ? await this.artistService.findOne(
            Number(artistId),
          )
        : null;
    }

    if (summary !== undefined) {
      article.summary =
        summary.trim()
          ? summary
          : null;
    }

    const savedArticle = await this.articleRepository.save(article);

    this.articleUpdates$.next({data: {action: 'updated', id: savedArticle.id, title: savedArticle.title, type: savedArticle.type}});

    return savedArticle;

  }

  async remove(id: number) {
    const article = await this.findOne(id);

    const removedArticle = { ...article };

    await this.articleRepository.remove(article);

    this.articleUpdates$.next({data: {action: 'deleted', id: removedArticle.id, title: removedArticle.title, type: removedArticle.type}});

    return removedArticle;
    }

  
  async findPage(page: number, limit: number){
    const [items, total] = await this.articleRepository.findAndCount({relations: {author: true, artist: true}, order: {publishedAt: 'DESC'}, skip: (page-1)*limit, take: limit});

    return {items, total};
  }

  async updateCover(id: number, coverUrl: string): Promise<Article> {
    const article = await this.findOne(id);
    article.coverUrl = coverUrl;
    return this.articleRepository.save(article);
  }
}
