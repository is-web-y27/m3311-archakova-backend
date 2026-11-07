import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { FeedbackService } from '../feedback.service';
import { FeedbackTypeGraphql } from './feedback.type';
import { PaginatedFeedbackType } from './paginated-feedback.type';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { UpdateFeedbackInput } from './dto/update-feedback.input';
import { UserTypeGraphql } from 'src/user/graphql/user.type';
import { PublicAccess } from 'src/infrastructure/auth/decorators/public-access.decorator';
import { Roles } from 'src/infrastructure/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user-role.enum';
import { CurrentUser } from 'src/infrastructure/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { assertOwnerOrAdmin } from 'src/infrastructure/auth/resource-access';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => FeedbackTypeGraphql)
export class FeedbackResolver {
    constructor(private readonly feedbackService: FeedbackService){}

    @Query(() => FeedbackTypeGraphql, {description: 'Отзыв по Id'})
    @PublicAccess()
    feedback(@Args('id', {type: () => Int}) id: number){
        return this.feedbackService.findOne(id);
    }

    @Query(() => PaginatedFeedbackType, {description: 'Отзывы с пагинацией'})
    @PublicAccess()
    async feedbacks(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.feedbackService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total / limit)};
    }

    @Mutation(() => FeedbackTypeGraphql, {description: 'Создать отзыв'})
    @Roles(UserRole.USER, UserRole.ADMIN)
    createFeedback(@Args('input') input: CreateFeedbackInput, @CurrentUser() user: User){
        return this.feedbackService.create({...input, userId: String(user.id)});
    }

    @Mutation(() => FeedbackTypeGraphql, {description: 'Изменить отзыв'})
    @Roles(UserRole.USER, UserRole.ADMIN)
    async updateFeedback(@Args('input') input: UpdateFeedbackInput, @Args('id', {type: () => Int}) id: number, @CurrentUser() user: User){
        const feedback = await this.feedbackService.findOne(id);
        assertOwnerOrAdmin(user, feedback.user.id);

        return this.feedbackService.update(id, {
            ...input,
            userId: user.role === UserRole.ADMIN ? input.userId : String(user.id),
        });
    }

    @Mutation(() => FeedbackTypeGraphql, {description: 'Удалить отзыв'})
    @Roles(UserRole.USER, UserRole.ADMIN)
    async removeFeedback(@Args('id', {type: () => Int}) id: number, @CurrentUser() user: User){
        const existingFeedback = await this.feedbackService.findOne(id);
        assertOwnerOrAdmin(user, existingFeedback.user.id);

        const feedback = await this.feedbackService.remove(id);
        return {...feedback, id};
    }

    @ResolveField(() => UserTypeGraphql, {description: 'Пользователь, оставивший отзыв'})
    @PublicAccess()
    async user(@Parent() feedback: FeedbackTypeGraphql){
        return feedback.user ?? (await this.feedbackService.findOne(feedback.id)).user;
    }
}
