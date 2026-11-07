import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { MusicLabelService } from '../music-label.service';
import { MusicLabelTypeGraphql } from './music-label.type';
import { PaginatedMusicLabelsType } from './paginated-music-labels.type';
import { CreateMusicLabelInput } from './dto/create-music-label.input';
import { UpdateMusicLabelInput } from './dto/update-music-label.input';
import { ArtistTypeGraphql } from 'src/artist/graphql/artist.type';
import { LabelStatTypeGraphql } from 'src/label-stat/graphql/label-stat.type';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => MusicLabelTypeGraphql)
export class MusicLabelResolver {
    constructor(private readonly musicLabelService: MusicLabelService){}

    @Query(() => MusicLabelTypeGraphql, {description: 'Музыкальный лейбл по Id'})
    musicLabel(@Args('id', {type: () => Int}) id: number){
        return this.musicLabelService.findOne(id);
    }

    @Query(() => PaginatedMusicLabelsType, {description: 'Музыкальные лейблы с пагинацией'})
    async musicLabels(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.musicLabelService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total / limit)};
    }

    @Mutation(() => MusicLabelTypeGraphql, {description: 'Создать музыкальный лейбл'})
    createMusicLabel(@Args('input') input: CreateMusicLabelInput){
        return this.musicLabelService.create(input);
    }

    @Mutation(() => MusicLabelTypeGraphql, {description: 'Изменить музыкальный лейбл'})
    updateMusicLabel(@Args('input') input: UpdateMusicLabelInput, @Args('id', {type: () => Int}) id: number){
        return this.musicLabelService.update(id, input);
    }

    @Mutation(() => MusicLabelTypeGraphql, {description: 'Удалить музыкальный лейбл'})
    async removeMusicLabel(@Args('id', {type: () => Int}) id: number){
        const musicLabel = await this.musicLabelService.remove(id);
        return {...musicLabel, id};
    }

    @ResolveField(() => [ArtistTypeGraphql], {description: 'Артисты музыкального лейбла'})
    artists(@Parent() musicLabel: MusicLabelTypeGraphql){
        return this.musicLabelService.findAllArtistsByLabel(musicLabel.id);
    }

    @ResolveField(() => [LabelStatTypeGraphql], {description: 'Статистика музыкального лейбла'})
    stats(@Parent() musicLabel: MusicLabelTypeGraphql){
        return this.musicLabelService.findAllStatsByLabel(musicLabel.id);
    }
}
