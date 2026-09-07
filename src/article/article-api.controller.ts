import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { createPaginationLinks } from "src/common/pagination-links";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import type { Response } from "express";
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArticleResponseDto } from "./dto/article-response.dto";
import { PaginatedArticlesResponseDto } from "./dto/paginated-articles-response.dto";
import { ErrorResponseDto } from "./dto/error-response.dto";

@ApiTags('Articles')
@Controller('api/articles')
export class ArticleApiController {
    constructor(private readonly articleService: ArticleService) {}

    @UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))

    @Get()
    @ApiOperation({summary: 'Получить страницу статей'})
    @ApiOkResponse({description: 'Страница статей получена', type: PaginatedArticlesResponseDto})
    @ApiBadRequestResponse({description: 'Некорректные параметры пагинации', type: ErrorResponseDto})
    async findAll(@Query() query: PaginationQueryDto, @Res({ passthrough: true }) response: Response,) {
        const { page, limit } = query;
        const { items, total } =
            await this.articleService.findPage( page, limit );
        const { totalPages, linkHeader } = createPaginationLinks('/api/articles', page, limit, total );

        if (linkHeader) {
            response.setHeader('Link', linkHeader);
        }

        return { items, page, limit, total, totalPages };
    }


    @Get(':id')
    @ApiOperation({summary: 'Получить статью по ID'})
    @ApiOkResponse({description: 'Статья найдена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Статья не найдена', type: ErrorResponseDto})
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.articleService.findOne(id);
    }

    @Post()
    @ApiOperation({summary: 'Создать статью'})
    @ApiCreatedResponse({description: 'Статья создана', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Автор или исполнитель не найден', type: ErrorResponseDto})
    create(@Body() createArticleDto: CreateArticleDto){
        return this.articleService.create(createArticleDto); 
    }

    @Patch(':id')
    @ApiOperation({summary: 'Обновить статью'})
    @ApiOkResponse({description: 'Статья обновлена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Статья, автор или исполнитель не найден', type: ErrorResponseDto})
    update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto){
        return this.articleService.update(id, updateArticleDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Удалить статью'})
    @ApiOkResponse({description: 'Статья удалена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Статья не найдена', type: ErrorResponseDto})
    @ApiConflictResponse({description: 'Удаление конфликтует со связанными данными', type: ErrorResponseDto})
    remove(@Param('id', ParseIntPipe) id: number){
        return this.articleService.remove(id);
    }
}

