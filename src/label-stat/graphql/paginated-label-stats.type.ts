import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LabelStatTypeGraphql } from './label-stat.type';

@ObjectType()
export class PaginatedLabelStatsType {
    @Field(() => [LabelStatTypeGraphql], {description: 'Записи статистики этой страницы'})
    items: LabelStatTypeGraphql[];

    @Field(() => Int, {description: 'Номер текущей страницы'})
    page: number;

    @Field(() => Int, {description: 'Определенное количество записей статистики на странице'})
    limit: number;

    @Field(() => Int, {description: 'Общее количество записей статистики всего'})
    total: number;

    @Field(() => Int, {description: 'Общее количество страниц'})
    totalPages: number;
}
