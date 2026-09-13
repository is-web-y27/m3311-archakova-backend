import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MusicLabelTypeGraphql } from './music-label.type';

@ObjectType()
export class PaginatedMusicLabelsType {
    @Field(() => [MusicLabelTypeGraphql], {description: 'Музыкальные лейблы этой страницы'})
    items: MusicLabelTypeGraphql[];

    @Field(() => Int, {description: 'Номер текущей страницы'})
    page: number;

    @Field(() => Int, {description: 'Определенное количество музыкальных лейблов на странице'})
    limit: number;

    @Field(() => Int, {description: 'Общее количество музыкальных лейблов всего'})
    total: number;

    @Field(() => Int, {description: 'Общее количество страниц'})
    totalPages: number;
}
