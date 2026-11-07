import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Res, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { LabelStatService } from "./label-stat.service";
import { CreateLabelStatDto } from "./dto/create-label-stat.dto";
import { UpdateLabelStatDto } from "./dto/update-label-stat.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import type { Response } from 'express';
import { createPaginationLinks } from "src/common/pagination-links";
import { ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LabelStatResponseDto } from "./dto/label-stat-response.dto";
import { PaginatedLabelStatsResponseDto } from "./dto/paginated-label-stats-response.dto";
import { BadRequestResponseDto, NotFoundResponseDto } from "src/article/dto/error-response.dto";
import { PublicAccess } from "src/infrastructure/auth/decorators/public-access.decorator";
import { Roles } from "src/infrastructure/auth/decorators/roles.decorator";
import { UserRole } from "src/user/entities/user-role.enum";

@ApiTags('Label stats')
@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Roles(UserRole.ADMIN)
@Controller('api/label-stats')
export class LabelStatApiController{
    constructor(private readonly labelStatService: LabelStatService){}

    @Get()
    @PublicAccess()
    @ApiOperation({summary: 'Получить страницу статистики лейблов'})
    @ApiOkResponse({description: 'Страница статистики получена', type: PaginatedLabelStatsResponseDto})
    @ApiBadRequestResponse({description: 'Некорректные параметры пагинации', type: BadRequestResponseDto})
    async findAll(@Query() query: PaginationQueryDto, @Res({passthrough: true}) response: Response){
        const {page, limit} = query;
        
        const {items, total} = await this.labelStatService.findPage(page, limit);
        const { totalPages, linkHeader} = createPaginationLinks('/api/label-stats', page, limit, total);
        
        if (linkHeader) {
            response.setHeader('Link', linkHeader);
        }
    
        return {items, page, limit, total, totalPages};
    }

    @Get(':id')
    @PublicAccess()
    @ApiOperation({summary: 'Получить запись статистики по ID'})
    @ApiOkResponse({description: 'Запись статистики найдена', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Запись статистики не найдена', type: NotFoundResponseDto})
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.labelStatService.findOne(id);
    }

    @Post()
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Создать запись статистики'})
    @ApiCreatedResponse({description: 'Запись статистики создана', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл не найден', type: NotFoundResponseDto})
    create(@Body() createLabelStatDto: CreateLabelStatDto){
        return this.labelStatService.create(createLabelStatDto);
    }

    @Patch(':id')
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Обновить запись статистики'})
    @ApiOkResponse({description: 'Запись статистики обновлена', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Запись статистики или музыкальный лейбл не найдены', type: NotFoundResponseDto})
    update(@Param('id', ParseIntPipe) id: number, @Body() updateLabelStatDto: UpdateLabelStatDto){
        return this.labelStatService.update(id, updateLabelStatDto);
    }

    @Delete(':id')
    @ApiCookieAuth('supertokens')
    @ApiOperation({summary: 'Удалить запись статистики'})
    @ApiOkResponse({description: 'Запись статистики удалена', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Запись статистики не найдена', type: NotFoundResponseDto})
    remove(@Param('id', ParseIntPipe) id: number){
        return this.labelStatService.remove(id);
    }
}
