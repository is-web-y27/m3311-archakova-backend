import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ArtistTypeGraphql } from './artist.type';
import { ArtistService } from '../artist.service';
import { PaginatedArtistsType } from './paginated-artists.type';
import { CreateArtistInput } from './dto/create-artist.input';
import { UpdateArtistInput } from './dto/update-artist.input';
import { ArticleTypeGraphql } from 'src/article/graphql/article.type';
import { MusicLabelTypeGraphql } from 'src/music-label/graphql/music-label.type';
import { PublicAccess } from 'src/infrastructure/auth/decorators/public-access.decorator';
import { Roles } from 'src/infrastructure/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user-role.enum';

@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Resolver(() => ArtistTypeGraphql)
export class ArtistResolver {
    constructor(private readonly artistService: ArtistService){}

    @Query(() => ArtistTypeGraphql, {description: 'Артист по Id'})
    @PublicAccess()
    artist(@Args('id', {type: () => Int}) id: number){
        return this.artistService.findOne(id);
    }

    @Query(() => PaginatedArtistsType, {description: 'Артисты с пагинацией'})
    @PublicAccess()
    async artists(@Args('page', {type: () => Int, nullable: true}) page = 1, @Args('limit', {type: () => Int, nullable: true}) limit = 10){
        const {items, total} = await this.artistService.findPage(page, limit);

        return {items, page, limit, total, totalPages: Math.ceil(total / limit)};
    }

    @Mutation(() => ArtistTypeGraphql, {description: 'Создать артиста'})
    @Roles(UserRole.ADMIN)
    createArtist(@Args('input') input: CreateArtistInput){
        return this.artistService.create(input);
    }

    @Mutation(() => ArtistTypeGraphql, {description: 'Изменить артиста'})
    @Roles(UserRole.ADMIN)
    updateArtist(@Args('input') input: UpdateArtistInput, @Args('id', {type: () => Int}) id: number){
        return this.artistService.update(id, input);
    }

    @Mutation(() => ArtistTypeGraphql, {description: 'Удалить артиста'})
    @Roles(UserRole.ADMIN)
    async removeArtist(@Args('id', {type: () => Int}) id: number){
        const artist = await this.artistService.remove(id);
        return {...artist, id};
    }

    @ResolveField(() => MusicLabelTypeGraphql, {description: 'Музыкальный лейбл артиста', nullable: true})
    @PublicAccess()
    async label(@Parent() artist: ArtistTypeGraphql){
        return artist.label ?? (await this.artistService.findOne(artist.id)).label;
    }

    @ResolveField(() => [ArticleTypeGraphql], {description: 'Статьи, связанные с артистом'})
    @PublicAccess()
    articles(@Parent() artist: ArtistTypeGraphql){
        return this.artistService.findAllArticles(artist.id);
    }
}
