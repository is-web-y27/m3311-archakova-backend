import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ArticleTypeGraphql } from "./article.type";

@ObjectType()
export class PaginatedArticlesType {
    @Field(() => [ArticleTypeGraphql], {description: 'Статьи этой страницы'})
    items: ArticleTypeGraphql[];

    @Field(() => Int, {description: 'Номер текущей страницы'})
    page: number;

    @Field(() => Int, {description: 'Определенное количество статей на странице'})
    limit: number;

    @Field(() => Int, {description: 'Общее количество статьей всего'})
    total: number;

    @Field(() => Int, {description: 'Общее количество страниц'})
    totalPages: number;
}