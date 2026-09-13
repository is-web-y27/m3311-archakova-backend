import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ArtistTypeGraphql } from './artist.type';

@ObjectType()
export class PaginatedArtistsType {
    @Field(() => [ArtistTypeGraphql], {description: 'Артисты этой страницы'})
    items: ArtistTypeGraphql[];

    @Field(() => Int, {description: 'Номер текущей страницы'})
    page: number;

    @Field(() => Int, {description: 'Определенное количество артистов на странице'})
    limit: number;

    @Field(() => Int, {description: 'Общее количество артистов всего'})
    total: number;

    @Field(() => Int, {description: 'Общее количество страниц'})
    totalPages: number;
}
