import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MusicLabelTypeGraphql } from 'src/music-label/graphql/music-label.type';

@ObjectType('LabelStat')
export class LabelStatTypeGraphql {
    @Field(() => Int, {description: 'Id записи статистики'})
    id: number;

    @Field(() => MusicLabelTypeGraphql, {description: 'Музыкальный лейбл'})
    label: MusicLabelTypeGraphql;

    @Field(() => Int, {description: 'Год статистики'})
    year: number;

    @Field({description: 'Доход музыкального лейбла'})
    revenue: string;

    @Field(() => String, {description: 'Доля музыкального лейбла на рынке', nullable: true})
    marketShare: string | null;

    @Field(() => Date, {description: 'Дата создания записи статистики'})
    createdAt: Date;
}
