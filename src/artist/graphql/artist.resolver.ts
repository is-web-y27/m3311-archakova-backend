import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ArtistTypeGraphql } from './artist.type';
import { ArtistService } from '../artist.service';
import { PaginatedArtistsType } from './paginated-artists.type';
import { CreateArtistInput } from './dto/create-artist.input';
import { UpdateArtistInput } from './dto/update-artist.input';
import { ArticleTypeGraphql } from 'src/article/graphql/article.type';
import { MusicLabelTypeGraphql } from 'src/music-label/graphql/music-label.type';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => ArtistTypeGraphql)
export class ArtistResolver {
    constructor(private readonly artistService: ArtistService){}

    @Query(() => ArtistTypeGraphql, {description: 'Артист по Id'})
    artist(@Args('id', {type: () => Int}) id: number){
        return this.artistService.findOne(id);
    }

    @Query(() => PaginatedArtistsType, {description: 'Артисты с пагинацией'})
    async artists(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.artistService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total / limit)};
    }

    @Mutation(() => ArtistTypeGraphql, {description: 'Создать артиста'})
    createArtist(@Args('input') input: CreateArtistInput){
        return this.artistService.create(input);
    }

    @Mutation(() => ArtistTypeGraphql, {description: 'Изменить артиста'})
    updateArtist(@Args('input') input: UpdateArtistInput, @Args('id', {type: () => Int}) id: number){
        return this.artistService.update(id, input);
    }

    @Mutation(() => ArtistTypeGraphql, {description: 'Удалить артиста'})
    async removeArtist(@Args('id', {type: () => Int}) id: number){
        const artist = await this.artistService.remove(id);
        return {...artist, id};
    }

    @ResolveField(() => MusicLabelTypeGraphql, {description: 'Музыкальный лейбл артиста', nullable: true})
    async label(@Parent() artist: ArtistTypeGraphql){
        return artist.label ?? (await this.artistService.findOne(artist.id)).label;
    }

    @ResolveField(() => [ArticleTypeGraphql], {description: 'Статьи, связанные с артистом'})
    articles(@Parent() artist: ArtistTypeGraphql){
        return this.artistService.findAllArticles(artist.id);
    }
}
