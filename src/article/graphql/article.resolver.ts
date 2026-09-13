import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ArticleTypeGraphql } from './article.type';
import { ArticleService } from '../article.service';
import { PaginatedArticlesType } from './paginated-articles.type';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { transform } from 'typescript';
import { UserTypeGraphql } from 'src/user/graphql/user.type';
import { ArtistTypeGraphql } from 'src/artist/graphql/artist.type';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => ArticleTypeGraphql)
export class ArticleResolver {
    constructor(private readonly articleService: ArticleService){}

    @Query(() => ArticleTypeGraphql, {description: 'Статья по Id'})
    article(@Args('id', { type: () => Int}) id: number){
        return this.articleService.findOne(id);
    }

    @Query(() => PaginatedArticlesType, {description: 'Статьи с пагинацией'})
    async articles(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.articleService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total/ limit)}
    }

    @Mutation(() => ArticleTypeGraphql, {description: 'Создать статью'})
    createArticle(@Args('input') input: CreateArticleInput){
        return this.articleService.create(input);
    }

    @Mutation(() => ArticleTypeGraphql, {description: 'Изменить статью'})
    updateArticle(@Args('input') input: UpdateArticleInput, @Args('id', {type: () => Int}) id: number){
        return this.articleService.update(id, input);
    }

    @Mutation(() => ArticleTypeGraphql, {description: 'Удалить статью'})
    removeArticle(@Args('id', {type: () => Int}) id: number){
        return this.articleService.remove(id);
    }
    
    @ResolveField(() => UserTypeGraphql, {description: 'Автор статьи'})
    author(@Parent() article: ArticleTypeGraphql) {
        return article.author;
    }

    @ResolveField(() => ArtistTypeGraphql, {description: 'Артист, связанный со статьей', nullable: true})
    artist(@Parent() article: ArticleTypeGraphql){
        return article.artist;
    }
}
