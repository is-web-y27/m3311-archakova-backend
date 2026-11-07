import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { FeedbackService } from '../feedback.service';
import { FeedbackTypeGraphql } from './feedback.type';
import { PaginatedFeedbackType } from './paginated-feedback.type';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { UpdateFeedbackInput } from './dto/update-feedback.input';
import { UserTypeGraphql } from 'src/user/graphql/user.type';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => FeedbackTypeGraphql)
export class FeedbackResolver {
    constructor(private readonly feedbackService: FeedbackService){}

    @Query(() => FeedbackTypeGraphql, {description: 'Отзыв по Id'})
    feedback(@Args('id', {type: () => Int}) id: number){
        return this.feedbackService.findOne(id);
    }

    @Query(() => PaginatedFeedbackType, {description: 'Отзывы с пагинацией'})
    async feedbacks(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.feedbackService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total / limit)};
    }

    @Mutation(() => FeedbackTypeGraphql, {description: 'Создать отзыв'})
    createFeedback(@Args('input') input: CreateFeedbackInput){
        return this.feedbackService.create(input);
    }

    @Mutation(() => FeedbackTypeGraphql, {description: 'Изменить отзыв'})
    updateFeedback(@Args('input') input: UpdateFeedbackInput, @Args('id', {type: () => Int}) id: number){
        return this.feedbackService.update(id, input);
    }

    @Mutation(() => FeedbackTypeGraphql, {description: 'Удалить отзыв'})
    async removeFeedback(@Args('id', {type: () => Int}) id: number){
        const feedback = await this.feedbackService.remove(id);
        return {...feedback, id};
    }

    @ResolveField(() => UserTypeGraphql, {description: 'Пользователь, оставивший отзыв'})
    async user(@Parent() feedback: FeedbackTypeGraphql){
        return feedback.user ?? (await this.feedbackService.findOne(feedback.id)).user;
    }
}
