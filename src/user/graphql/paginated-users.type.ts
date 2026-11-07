import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserTypeGraphql } from './user.type';

@ObjectType()
export class PaginatedUsersType {
    @Field(() => [UserTypeGraphql], {description: 'Пользователи этой страницы'})
    items: UserTypeGraphql[];

    @Field(() => Int, {description: 'Номер текущей страницы'})
    page: number;

    @Field(() => Int, {description: 'Определенное количество пользователей на странице'})
    limit: number;

    @Field(() => Int, {description: 'Общее количество пользователей всего'})
    total: number;

    @Field(() => Int, {description: 'Общее количество страниц'})
    totalPages: number;
}
