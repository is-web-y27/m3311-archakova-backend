import { Body, Controller, Delete, Get, Header, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { createPaginationLinks } from "src/common/pagination-links";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import type { Response } from "express";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArticleResponseDto } from "./dto/article-response.dto";
import { PaginatedArticlesResponseDto } from "./dto/paginated-articles-response.dto";
import { BadRequestResponseDto, NotFoundResponseDto } from "./dto/error-response.dto";
import { ETagInterceptor } from "src/common/interceptors/etag.interceptor";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { StorageService } from "src/infrastructure/storage/storage.service";
import { FileInterceptor } from "@nestjs/platform-express";

@UseInterceptors(ETagInterceptor, CacheInterceptor)
@ApiTags('Articles')
@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Controller('api/articles')
export class ArticleApiController {
    constructor(private readonly articleService: ArticleService, private readonly storageService: StorageService) {}

    @Get()
    @CacheTTL(5000)
    @ApiOperation({summary: 'Получить страницу статей'})
    @ApiOkResponse({description: 'Страница статей получена', type: PaginatedArticlesResponseDto})
    @ApiBadRequestResponse({description: 'Некорректные параметры пагинации', type: BadRequestResponseDto})
    @Header('Cache-Control', 'public, max-age=60')
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
    @CacheTTL(5000)
    @ApiOperation({summary: 'Получить статью по ID'})
    @ApiOkResponse({description: 'Статья найдена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Статья не найдена', type: NotFoundResponseDto})
    @Header('Cache-Control', 'public, max-age=60')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.articleService.findOne(id);
    }

    @Post(':id/cover')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCover(  
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile(
            new ParseFilePipeBuilder().addFileTypeValidator({fileType: /^image\/(jpeg|png|webp)$/}).addMaxSizeValidator({maxSize: 5 * 1024 * 1024}).build()) file: Express.Multer.File) {
        await this.articleService.findOne(id);
        const coverUrl = await this.storageService.uploadArticleCover(file);
        return this.articleService.updateCover(id, coverUrl);
    }
    
    @Post()
    @ApiOperation({summary: 'Создать статью'})
    @ApiCreatedResponse({description: 'Статья создана', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Автор или исполнитель не найден', type: NotFoundResponseDto})
    create(@Body() createArticleDto: CreateArticleDto){
        return this.articleService.create(createArticleDto); 
    }

    @Patch(':id')
    @ApiOperation({summary: 'Обновить статью'})
    @ApiOkResponse({description: 'Статья обновлена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Статья, автор или исполнитель не найден', type: NotFoundResponseDto})
    update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto){
        return this.articleService.update(id, updateArticleDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Удалить статью'})
    @ApiOkResponse({description: 'Статья удалена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Статья не найдена', type: NotFoundResponseDto})
    remove(@Param('id', ParseIntPipe) id: number){
        return this.articleService.remove(id);
    }
}

