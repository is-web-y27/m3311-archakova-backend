import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { FeedbackService } from "./feedback.service"
import { CreateOwnFeedbackDto } from "./dto/create-own-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import { createPaginationLinks } from "src/common/pagination-links";
import  type {Response} from 'express';
import { ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FeedbackResponseDto } from "./dto/feedback-response.dto";
import { PaginatedFeedbackResponseDto } from "./dto/paginated-feedback-response.dto";
import { BadRequestResponseDto, NotFoundResponseDto } from "src/article/dto/error-response.dto";
import { PublicAccess } from "src/infrastructure/auth/decorators/public-access.decorator";
import { Roles } from "src/infrastructure/auth/decorators/roles.decorator";
import { CurrentUser } from "src/infrastructure/auth/decorators/current-user.decorator";
import { UserRole } from "src/user/entities/user-role.enum";
import { User } from "src/user/entities/user.entity";
import { assertOwnerOrAdmin } from "src/infrastructure/auth/resource-access";

@ApiTags('Feedback')
@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Roles(UserRole.USER, UserRole.ADMIN)
@Controller('api/feedback')
export class FeedbackApiController{
    constructor(private readonly feedbackService: FeedbackService){
        
    }

    @Get()
    @PublicAccess()
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
    @PublicAccess()
    @ApiOperation({summary: 'Получить отзыв по ID'})
    @ApiOkResponse({description: 'Отзыв найден', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Отзыв не найден', type: NotFoundResponseDto})
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.feedbackService.findOne(id);
    }

    @Post()
    @Roles(UserRole.USER, UserRole.ADMIN)
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Создать отзыв'})
    @ApiCreatedResponse({description: 'Отзыв создан', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Пользователь не найден', type: NotFoundResponseDto})
    create(@Body() createFeedbackDto: CreateOwnFeedbackDto, @CurrentUser() user: User){
        return this.feedbackService.create({...createFeedbackDto, userId: String(user.id)});
    }

    @Patch(':id')
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Обновить отзыв'})
    @ApiOkResponse({description: 'Отзыв обновлён', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Отзыв или пользователь не найдены', type: NotFoundResponseDto})
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateFeedbackDto: UpdateFeedbackDto, @CurrentUser() user: User){
        const feedback = await this.feedbackService.findOne(id);
        assertOwnerOrAdmin(user, feedback.user.id);

        return this.feedbackService.update(id, {
            ...updateFeedbackDto,
            userId: user.role === UserRole.ADMIN
                ? updateFeedbackDto.userId
                : String(user.id),
        });
    }

    @Delete(':id')
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Удалить отзыв'})
    @ApiOkResponse({description: 'Отзыв удалён', type: FeedbackResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Отзыв не найден', type: NotFoundResponseDto})
    async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User){
        const feedback = await this.feedbackService.findOne(id);
        assertOwnerOrAdmin(user, feedback.user.id);

        return this.feedbackService.remove(id);
    }
}
