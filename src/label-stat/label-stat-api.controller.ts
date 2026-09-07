import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Res, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { LabelStatService } from "./label-stat.service";
import { CreateLabelStatDto } from "./dto/create-label-stat.dto";
import { UpdateLabelStatDto } from "./dto/update-label-stat.dto";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import type { Response } from 'express';
import { createPaginationLinks } from "src/common/pagination-links";
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LabelStatResponseDto } from "./dto/label-stat-response.dto";
import { PaginatedLabelStatsResponseDto } from "./dto/paginated-label-stats-response.dto";
import { ErrorResponseDto } from "src/article/dto/error-response.dto";

@ApiTags('Label stats')
@Controller('api/label-stats')
export class LabelStatApiController{
    constructor(private readonly labelStatService: LabelStatService){}

    @UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
    
    @Get()
    @ApiOperation({summary: 'Получить страницу статистики лейблов'})
    @ApiOkResponse({description: 'Страница статистики получена', type: PaginatedLabelStatsResponseDto})
    @ApiBadRequestResponse({description: 'Некорректные параметры пагинации', type: ErrorResponseDto})
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
    @ApiOperation({summary: 'Получить запись статистики по ID'})
    @ApiOkResponse({description: 'Запись статистики найдена', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Запись статистики не найдена', type: ErrorResponseDto})
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.labelStatService.findOne(id);
    }

    @Post()
    @ApiOperation({summary: 'Создать запись статистики'})
    @ApiCreatedResponse({description: 'Запись статистики создана', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл не найден', type: ErrorResponseDto})
    @ApiConflictResponse({description: 'Запись конфликтует с существующими данными', type: ErrorResponseDto})
    create(@Body() createLabelStatDto: CreateLabelStatDto){
        return this.labelStatService.create(createLabelStatDto);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Обновить запись статистики'})
    @ApiOkResponse({description: 'Запись статистики обновлена', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Запись статистики или музыкальный лейбл не найдены', type: ErrorResponseDto})
    @ApiConflictResponse({description: 'Запись конфликтует с существующими данными', type: ErrorResponseDto})
    update(@Param('id', ParseIntPipe) id: number, @Body() updateLabelStatDto: UpdateLabelStatDto){
        return this.labelStatService.update(id, updateLabelStatDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Удалить запись статистики'})
    @ApiOkResponse({description: 'Запись статистики удалена', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: ErrorResponseDto})
    @ApiNotFoundResponse({description: 'Запись статистики не найдена', type: ErrorResponseDto})
    remove(@Param('id', ParseIntPipe) id: number){
        return this.labelStatService.remove(id);
    }
}
