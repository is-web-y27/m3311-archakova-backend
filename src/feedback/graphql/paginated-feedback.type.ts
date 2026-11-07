import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FeedbackTypeGraphql } from './feedback.type';

@ObjectType()
export class PaginatedFeedbackType {
    @Field(() => [FeedbackTypeGraphql], {description: 'Отзывы этой страницы'})
    items: FeedbackTypeGraphql[];

    @Field(() => Int, {description: 'Номер текущей страницы'})
    page: number;

    @Field(() => Int, {description: 'Определенное количество отзывов на странице'})
    limit: number;

    @Field(() => Int, {description: 'Общее количество отзывов всего'})
    total: number;

    @Field(() => Int, {description: 'Общее количество страниц'})
    totalPages: number;
}
