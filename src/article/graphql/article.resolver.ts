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
import { PublicAccess } from 'src/infrastructure/auth/decorators/public-access.decorator';
import { Roles } from 'src/infrastructure/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user-role.enum';
import { CurrentUser } from 'src/infrastructure/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { assertOwnerOrAdmin } from 'src/infrastructure/auth/resource-access';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => ArticleTypeGraphql)
export class ArticleResolver {
    constructor(private readonly articleService: ArticleService){}

    @Query(() => ArticleTypeGraphql, {description: 'Статья по Id'})
    @PublicAccess()
    article(@Args('id', { type: () => Int}) id: number){
        return this.articleService.findOne(id);
    }

    @Query(() => PaginatedArticlesType, {description: 'Статьи с пагинацией'})
    @PublicAccess()
    async articles(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.articleService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total/ limit)}
    }

    @Mutation(() => ArticleTypeGraphql, {description: 'Создать статью'})
    @Roles(UserRole.USER, UserRole.ADMIN)
    createArticle(@Args('input') input: CreateArticleInput, @CurrentUser() user: User){
        return this.articleService.create({
            ...input,
            authorId: user.role === UserRole.ADMIN ? input.authorId : String(user.id),
        });
    }

    @Mutation(() => ArticleTypeGraphql, {description: 'Изменить статью'})
    @Roles(UserRole.USER, UserRole.ADMIN)
    async updateArticle(@Args('input') input: UpdateArticleInput, @Args('id', {type: () => Int}) id: number, @CurrentUser() user: User){
        const article = await this.articleService.findOne(id);
        assertOwnerOrAdmin(user, article.author.id);

        return this.articleService.update(id, {
            ...input,
            authorId: user.role === UserRole.ADMIN ? input.authorId : String(user.id),
        });
    }

    @Mutation(() => ArticleTypeGraphql, {description: 'Удалить статью'})
    @Roles(UserRole.USER, UserRole.ADMIN)
    async removeArticle(@Args('id', {type: () => Int}) id: number, @CurrentUser() user: User){
        const article = await this.articleService.findOne(id);
        assertOwnerOrAdmin(user, article.author.id);

        return this.articleService.remove(id);
    }
    
    @ResolveField(() => UserTypeGraphql, {description: 'Автор статьи'})
    @PublicAccess()
    author(@Parent() article: ArticleTypeGraphql) {
        return article.author;
    }

    @ResolveField(() => ArtistTypeGraphql, {description: 'Артист, связанный со статьей', nullable: true})
    @PublicAccess()
    artist(@Parent() article: ArticleTypeGraphql){
        return article.artist;
    }
}
