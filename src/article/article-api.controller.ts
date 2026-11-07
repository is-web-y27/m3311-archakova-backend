import { Body, Controller, Delete, Get, Header, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateAuthenticatedArticleDto } from "./dto/create-authenticated-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { createPaginationLinks } from "src/common/pagination-links";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import type { Response } from "express";
import { ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArticleResponseDto } from "./dto/article-response.dto";
import { PaginatedArticlesResponseDto } from "./dto/paginated-articles-response.dto";
import { BadRequestResponseDto, NotFoundResponseDto } from "./dto/error-response.dto";
import { ETagInterceptor } from "src/common/interceptors/etag.interceptor";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { StorageService } from "src/infrastructure/storage/storage.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { PublicAccess } from "src/infrastructure/auth/decorators/public-access.decorator";
import { Roles } from "src/infrastructure/auth/decorators/roles.decorator";
import { UserRole } from "src/user/entities/user-role.enum";
import { CurrentUser } from "src/infrastructure/auth/decorators/current-user.decorator";
import { User } from "src/user/entities/user.entity";
import { assertOwnerOrAdmin } from "src/infrastructure/auth/resource-access";

@UseInterceptors(ETagInterceptor, CacheInterceptor)
@ApiTags('Articles')
@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Roles(UserRole.USER, UserRole.ADMIN)
@Controller('api/articles')
export class ArticleApiController {
    constructor(private readonly articleService: ArticleService, private readonly storageService: StorageService) {}

    @Get()
    @PublicAccess()
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
    @PublicAccess()
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
    @ApiCookieAuth('supertokens')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCover(  
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @UploadedFile(
            new ParseFilePipeBuilder().addFileTypeValidator({fileType: /^image\/(jpeg|png|webp)$/}).addMaxSizeValidator({maxSize: 5 * 1024 * 1024}).build()) file: Express.Multer.File) {
        const article = await this.articleService.findOne(id);
        assertOwnerOrAdmin(user, article.author.id);
        const coverUrl = await this.storageService.uploadArticleCover(file);
        return this.articleService.updateCover(id, coverUrl);
    }
    
    @Post()
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Создать статью'})
    @ApiCreatedResponse({description: 'Статья создана', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Автор или исполнитель не найден', type: NotFoundResponseDto})
    create(@Body() createArticleDto: CreateAuthenticatedArticleDto, @CurrentUser() user: User){
        return this.articleService.create({
            ...createArticleDto,
            authorId: user.role === UserRole.ADMIN
                ? createArticleDto.authorId ?? ''
                : String(user.id),
        });
    }

    @Patch(':id')
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Обновить статью'})
    @ApiOkResponse({description: 'Статья обновлена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Статья, автор или исполнитель не найден', type: NotFoundResponseDto})
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto, @CurrentUser() user: User){
        const article = await this.articleService.findOne(id);
        assertOwnerOrAdmin(user, article.author.id);

        return this.articleService.update(id, {
            ...updateArticleDto,
            authorId: user.role === UserRole.ADMIN
                ? updateArticleDto.authorId
                : String(user.id),
        });
    }

    @Delete(':id')
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Удалить статью'})
    @ApiOkResponse({description: 'Статья удалена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Статья не найдена', type: NotFoundResponseDto})
    async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User){
        const article = await this.articleService.findOne(id);
        assertOwnerOrAdmin(user, article.author.id);

        return this.articleService.remove(id);
    }
}

