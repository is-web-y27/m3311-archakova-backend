import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ArtistTypeGraphql } from 'src/artist/graphql/artist.type';
import { LabelStatTypeGraphql } from 'src/label-stat/graphql/label-stat.type';

@ObjectType('MusicLabel')
export class MusicLabelTypeGraphql {
    @Field(() => Int, {description: 'Id музыкального лейбла'})
    id: number;

    @Field({description: 'Название музыкального лейбла'})
    name: string;

    @Field(() => String, {description: 'Страна музыкального лейбла', nullable: true})
    country: string | null;

    @Field(() => String, {description: 'Описание музыкального лейбла', nullable: true})
    description: string | null;

    @Field(() => [ArtistTypeGraphql], {description: 'Артисты музыкального лейбла'})
    artists: ArtistTypeGraphql[];

    @Field(() => [LabelStatTypeGraphql], {description: 'Статистика музыкального лейбла'})
    stats: LabelStatTypeGraphql[];

    @Field(() => Date, {description: 'Дата создания музыкального лейбла'})
    createdAt: Date;

    @Field(() => Date, {description: 'Дата обновления музыкального лейбла'})
    updatedAt: Date;
}
