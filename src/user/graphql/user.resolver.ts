import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UserTypeGraphql } from './user.type';
import { UserService } from '../user.service';
import { PaginatedUsersType } from './paginated-users.type';
import { ArticleTypeGraphql } from 'src/article/graphql/article.type';
import { FeedbackTypeGraphql } from 'src/feedback/graphql/feedback.type';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => UserTypeGraphql)
export class UserResolver {
    constructor(private readonly userService: UserService){}

    @Query(() => UserTypeGraphql, {description: 'Пользователь по Id'})
    user(@Args('id', {type: () => Int}) id: number){
        return this.userService.findOne(id);
    }

    @Query(() => PaginatedUsersType, {description: 'Пользователи с пагинацией'})
    async users(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.userService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total / limit)};
    }

    @Mutation(() => UserTypeGraphql, {description: 'Создать пользователя'})
    createUser(@Args('input') input: CreateUserInput){
        return this.userService.create(input);
    }

    @Mutation(() => UserTypeGraphql, {description: 'Изменить пользователя'})
    updateUser(@Args('input') input: UpdateUserInput, @Args('id', {type: () => Int}) id: number){
        return this.userService.update(id, input);
    }

    @Mutation(() => UserTypeGraphql, {description: 'Удалить пользователя'})
    async removeUser(@Args('id', {type: () => Int}) id: number){
        const user = await this.userService.remove(id);
        return {...user, id};
    }

    @ResolveField(() => [ArticleTypeGraphql], {description: 'Статьи пользователя'})
    articles(@Parent() user: UserTypeGraphql){
        return this.userService.findAllArticlesByUser(user.id);
    }

    @ResolveField(() => [FeedbackTypeGraphql], {description: 'Отзывы пользователя'})
    feedbacks(@Parent() user: UserTypeGraphql){
        return this.userService.findAllFeedbackByUser(user.id);
    }
}

