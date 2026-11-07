import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { FeedbackService } from "./feedback.service"
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import { createPaginationLinks } from "src/common/pagination-links";
import  type {Response} from 'express';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FeedbackResponseDto } from "./dto/feedback-response.dto";
import { PaginatedFeedbackResponseDto } from "./dto/paginated-feedback-response.dto";
import { BadRequestResponseDto, NotFoundResponseDto } from "src/article/dto/error-response.dto";

@ApiTags('Feedback')
@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Controller('api/feedback')
export class FeedbackApiController{
    constructor(private readonly feedbackService: FeedbackService){
        
    }

    @Get()
    @ApiOperation({summary: 'Получить страницу отзывов'})
    @ApiOkResponse({description: 'Страница отзывов получена', type: PaginatedFeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректные параметры пагинации', type: BadRequestResponseDto})
    async findAll(@Query() query: PaginationQueryDto, @Res({passthrough: true}) response: Response){
        const {page, limit} = query;
            
        const {items, total} = await this.feedbackService.findPage(page, limit);
        const { totalPages, linkHeader} = createPaginationLinks('/api/feedback', page, limit, total);
            
        if (linkHeader) {
            response.setHeader('Link', linkHeader);
        }
        
        return {items, page, limit, total, totalPages};
    }

    @Get(':id')
    @ApiOperation({summary: 'Получить отзыв по ID'})
    @ApiOkResponse({description: 'Отзыв найден', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Отзыв не найден', type: NotFoundResponseDto})
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.feedbackService.findOne(id);
    }

    @Post()
    @ApiOperation({summary: 'Создать отзыв'})
    @ApiCreatedResponse({description: 'Отзыв создан', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь не найден', type: NotFoundResponseDto})
    create(@Body() createFeedbackDto: CreateFeedbackDto){
        return this.feedbackService.create(createFeedbackDto);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Обновить отзыв'})
    @ApiOkResponse({description: 'Отзыв обновлён', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Отзыв или пользователь не найдены', type: NotFoundResponseDto})
    update(@Param('id', ParseIntPipe) id: number, @Body() updateFeedbackDto: UpdateFeedbackDto){
        return this.feedbackService.update(id, updateFeedbackDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Удалить отзыв'})
    @ApiOkResponse({description: 'Отзыв удалён', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Отзыв не найден', type: NotFoundResponseDto})
    remove(@Param('id', ParseIntPipe) id: number){
        return this.feedbackService.remove(id);
    }
}
