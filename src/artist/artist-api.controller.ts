import { Post, Body, Controller, Get, Param, Patch, Delete, ValidationPipe, UsePipes, ParseIntPipe, Res, Query } from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import type { Response } from 'express';
import { createPaginationLinks } from "src/common/pagination-links";
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArtistResponseDto } from "./dto/artist-response.dto";
import { PaginatedArtistsResponseDto } from "./dto/paginated-artists-response.dto";
import { ArticleResponseDto } from "src/article/dto/article-response.dto";
import { ErrorResponseDto } from "src/article/dto/error-response.dto";

@ApiTags('Artists')
@Controller('api/artists')
export class ArtistApiController {
    constructor(private readonly artistService: ArtistService){}

    @UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
    @Get()
    @ApiOperation({summary: 'Получить страницу исполнителей'})
    @ApiOkResponse({description: 'Страница исполнителей получена', type: PaginatedArtistsResponseDto})
    @ApiBadRequestResponse({description: 'Некорректные параметры пагинации', type: ErrorResponseDto})
    async findAll(@Query() query: PaginationQueryDto, @Res({passthrough: true}) response: Response){
        const {page, limit} = query;

        const {items, total} = await this.artistService.findPage(page, limit);
        const { totalPages, linkHeader} = createPaginationLinks('/api/artists', page, limit, total);

        if (linkHeader) {
            response.setHeader('Link', linkHeader);
        }

        return {items, page, limit, total, totalPages};
    }

    @Get(':id')
    @ApiOperation({summary: 'Получить исполнителя по ID'})
    @ApiOkResponse({description: 'Исполнитель найден', type: ArtistResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Исполнитель не найден', type: ErrorResponseDto})
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.artistService.findOne(id);
    }

    @Get(':artistId/articles')
    @ApiOperation({summary: 'Получить статьи исполнителя'})
    @ApiOkResponse({description: 'Статьи исполнителя получены', type: ArticleResponseDto, isArray: true})
    @ApiBadRequestResponse({description: 'Некорректный ID исполнителя', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Исполнитель не найден', type: ErrorResponseDto})
    findArticles(@Param('artistId', ParseIntPipe) artistId: number){
        return this.artistService.findAllArticles(artistId);
    }

    @Get(':artistId/articles/:articleId')
    @ApiOperation({summary: 'Получить статью исполнителя'})
    @ApiOkResponse({description: 'Статья исполнителя найдена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Исполнитель или статья не найдены', type: ErrorResponseDto})
    findArticle(@Param('artistId', ParseIntPipe) artistId: number, @Param('articleId', ParseIntPipe) articleId: number){
        return this.artistService.findOneArticle(artistId, articleId);
    }

    @Post()
    @ApiOperation({summary: 'Создать исполнителя'})
    @ApiCreatedResponse({description: 'Исполнитель создан', type: ArtistResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл не найден', type: ErrorResponseDto})
    create(@Body() createArtistDto: CreateArtistDto){
        return this.artistService.create(createArtistDto);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Обновить исполнителя'})
    @ApiOkResponse({description: 'Исполнитель обновлён', type: ArtistResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Исполнитель или музыкальный лейбл не найден', type: ErrorResponseDto})
    update(@Param('id', ParseIntPipe) id: number, @Body() updateArtistDto: UpdateArtistDto){
        return this.artistService.update(id, updateArtistDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Удалить исполнителя'})
    @ApiOkResponse({description: 'Исполнитель удалён', type: ArtistResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Исполнитель не найден', type: ErrorResponseDto})
    @ApiConflictResponse({description: 'Удаление конфликтует со связанными данными', type: ErrorResponseDto})
    remove(@Param('id', ParseIntPipe) id: number){
        return this.artistService.remove(id);
    }
}
