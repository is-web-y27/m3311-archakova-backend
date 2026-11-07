import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LabelStatService } from '../label-stat.service';
import { LabelStatTypeGraphql } from './label-stat.type';
import { PaginatedLabelStatsType } from './paginated-label-stats.type';
import { CreateLabelStatInput } from './dto/create-label-stat.input';
import { UpdateLabelStatInput } from './dto/update-label-stat.input';
import { MusicLabelTypeGraphql } from 'src/music-label/graphql/music-label.type';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => LabelStatTypeGraphql)
export class LabelStatResolver {
    constructor(private readonly labelStatService: LabelStatService){}

    @Query(() => LabelStatTypeGraphql, {description: 'Запись статистики по Id'})
    labelStat(@Args('id', {type: () => Int}) id: number){
        return this.labelStatService.findOne(id);
    }

    @Query(() => PaginatedLabelStatsType, {description: 'Статистика музыкальных лейблов с пагинацией'})
    async labelStats(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.labelStatService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total / limit)};
    }

    @Mutation(() => LabelStatTypeGraphql, {description: 'Создать запись статистики'})
    createLabelStat(@Args('input') input: CreateLabelStatInput){
        return this.labelStatService.create(input);
    }

    @Mutation(() => LabelStatTypeGraphql, {description: 'Изменить запись статистики'})
    updateLabelStat(@Args('input') input: UpdateLabelStatInput, @Args('id', {type: () => Int}) id: number){
        return this.labelStatService.update(id, input);
    }

    @Mutation(() => LabelStatTypeGraphql, {description: 'Удалить запись статистики'})
    async removeLabelStat(@Args('id', {type: () => Int}) id: number){
        const labelStat = await this.labelStatService.remove(id);
        return {...labelStat, id};
    }

    @ResolveField(() => MusicLabelTypeGraphql, {description: 'Музыкальный лейбл'})
    async label(@Parent() labelStat: LabelStatTypeGraphql){
        return labelStat.label ?? (await this.labelStatService.findOne(labelStat.id)).label;
    }
}
