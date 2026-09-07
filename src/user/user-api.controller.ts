import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import { createPaginationLinks } from "src/common/pagination-links";
import type {Response } from "express";
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserResponseDto } from "./dto/user-response.dto";
import { PaginatedUsersResponseDto } from "./dto/paginated-users-response.dto";
import { ArticleResponseDto } from "src/article/dto/article-response.dto";
import { FeedbackResponseDto } from "src/feedback/dto/feedback-response.dto";
import { ErrorResponseDto } from "src/article/dto/error-response.dto";

@ApiTags('Users')
@Controller('api/users')
export class UserApiController{
    constructor(private readonly userService: UserService){}

    @UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
    
    @Get()
    @ApiOperation({summary: 'Получить страницу пользователей'})
    @ApiOkResponse({description: 'Страница пользователей получена', type: PaginatedUsersResponseDto})
    @ApiBadRequestResponse({description: 'Некорректные параметры пагинации', type: ErrorResponseDto})
    async findAll(@Query() query: PaginationQueryDto, @Res({ passthrough: true }) response: Response) {
        const { page, limit } = query;
        const { items, total } =
        await this.userService.findPage(page, limit);
        const { totalPages, linkHeader } = createPaginationLinks('/api/users', page, limit, total);

        if (linkHeader) { 
            response.setHeader('Link', linkHeader);
        }

        return {items, page, limit, total, totalPages};
    }

    @Get(':id')
    @ApiOperation({summary: 'Получить пользователя по ID'})
    @ApiOkResponse({description: 'Пользователь найден', type: UserResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь не найден', type: ErrorResponseDto})
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.userService.findOne(id);
    }

    @Get(':userId/articles')
    @ApiOperation({summary: 'Получить статьи пользователя'})
    @ApiOkResponse({description: 'Статьи пользователя получены', type: ArticleResponseDto, isArray: true})
    @ApiBadRequestResponse({description: 'Некорректный ID пользователя', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь не найден', type: ErrorResponseDto})
    findAllArticlesByUser(@Param('userId', ParseIntPipe) userId: number){
        return this.userService.findAllArticlesByUser((userId));
    }

    @Get(':userId/articles/:articleId')
    @ApiOperation({summary: 'Получить статью пользователя'})
    @ApiOkResponse({description: 'Статья пользователя найдена', type: ArticleResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь или статья не найдены', type: ErrorResponseDto})
    findOneArticleByUser(@Param('userId', ParseIntPipe) userId: number, @Param('articleId', ParseIntPipe) articleId: number){
        return this.userService.findOneArticleByUser(userId, articleId);
    }

    @Get(':userId/feedback')
    @ApiOperation({summary: 'Получить отзывы пользователя'})
    @ApiOkResponse({description: 'Отзывы пользователя получены', type: FeedbackResponseDto, isArray: true})
    @ApiBadRequestResponse({description: 'Некорректный ID пользователя', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь не найден', type: ErrorResponseDto})
    findAllFeedbackByUser(@Param('userId', ParseIntPipe) userId: number){
        return this.userService.findAllFeedbackByUser(userId);
    }

    @Get(':userId/feedback/:feedbackId')
    @ApiOperation({summary: 'Получить отзыв пользователя'})
    @ApiOkResponse({description: 'Отзыв пользователя найден', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь или отзыв не найдены', type: ErrorResponseDto})
    findOneFeedbackByUser(@Param('userId', ParseIntPipe) userId: number, @Param('feedbackId', ParseIntPipe) feedbackId: number){
        return this.userService.findOneFeedbackByUser(userId, feedbackId);
    }

    @Post()
    @ApiOperation({summary: 'Создать пользователя'})
    @ApiCreatedResponse({description: 'Пользователь создан', type: UserResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: ErrorResponseDto})
    @ApiConflictResponse({description: 'Пользователь с такой почтой уже существует', type: ErrorResponseDto})
    create(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Обновить пользователя'})
    @ApiOkResponse({description: 'Пользователь обновлён', type: UserResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь не найден', type: ErrorResponseDto})
    @ApiConflictResponse({description: 'Пользователь с такой почтой уже существует', type: ErrorResponseDto})
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto){
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Удалить пользователя'})
    @ApiOkResponse({description: 'Пользователь удалён', type: UserResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь не найден', type: ErrorResponseDto})
    @ApiConflictResponse({description: 'Удаление конфликтует со связанными данными', type: ErrorResponseDto})
    remove(@Param('id', ParseIntPipe) id: number){
        return this.userService.remove(id);
    }
}
