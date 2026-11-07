import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { MusicLabelService } from "./music-label.service";
import { CreateMusicLabelDto } from "./dto/create-music-label.dto";
import { UpdateMusicLabelDto } from "./dto/update-music-label.dto";
import { createPaginationLinks } from "src/common/pagination-links";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import type { Response} from 'express';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MusicLabelResponseDto } from "./dto/music-label-response.dto";
import { PaginatedMusicLabelsResponseDto } from "./dto/paginated-music-labels-response.dto";
import { ArtistResponseDto } from "src/artist/dto/artist-response.dto";
import { LabelStatResponseDto } from "src/label-stat/dto/label-stat-response.dto";
import { BadRequestResponseDto, ConflictResponseDto, NotFoundResponseDto } from "src/article/dto/error-response.dto";

@ApiTags('Music labels')
@UsePipes(new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true}))
@Controller('api/music-labels')
export class MusicLabelApiController{
    constructor(private readonly musicLabelService: MusicLabelService){}

    @Get()
    @ApiOperation({summary: 'Получить страницу музыкальных лейблов'})
    @ApiOkResponse({description: 'Страница музыкальных лейблов получена', type: PaginatedMusicLabelsResponseDto})
    @ApiBadRequestResponse({description: 'Некорректные параметры пагинации', type: BadRequestResponseDto})
    async findAll(@Query() query: PaginationQueryDto, @Res({passthrough: true}) response: Response){
        const {page, limit} = query;
    
        const {items, total} = await this.musicLabelService.findPage(page, limit);
        const { totalPages, linkHeader} = createPaginationLinks('/api/music-labels', page, limit, total);
    
        if (linkHeader) {
            response.setHeader('Link', linkHeader);
        }

        return {items, page, limit, total, totalPages};
    }    

    @Get(':id')
    @ApiOperation({summary: 'Получить музыкальный лейбл по ID'})
    @ApiOkResponse({description: 'Музыкальный лейбл найден', type: MusicLabelResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл не найден', type: NotFoundResponseDto})
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.musicLabelService.findOne(id);
    }

    @Get(':labelId/artists')
    @ApiOperation({summary: 'Получить исполнителей музыкального лейбла'})
    @ApiOkResponse({description: 'Исполнители музыкального лейбла получены', type: ArtistResponseDto, isArray: true})
    @ApiBadRequestResponse({description: 'Некорректный ID лейбла', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл не найден', type: NotFoundResponseDto})
    findAllArtistsByLabel(@Param('labelId', ParseIntPipe) labelId: number){
        return this.musicLabelService.findAllArtistsByLabel(labelId);
    }

    @Get(':labelId/artists/:artistId')
    @ApiOperation({summary: 'Получить исполнителя музыкального лейбла'})
    @ApiOkResponse({description: 'Исполнитель музыкального лейбла найден', type: ArtistResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл или исполнитель не найдены', type: NotFoundResponseDto})
    findOneArtistByLabel(@Param('artistId', ParseIntPipe) artistId: number, @Param('labelId', ParseIntPipe) labelId: number){
        return this.musicLabelService.findOneArtistByLabel(artistId, labelId);
    }

    @Get(':labelId/label-stats')
    @ApiOperation({summary: 'Получить статистику музыкального лейбла'})
    @ApiOkResponse({description: 'Статистика музыкального лейбла получена', type: LabelStatResponseDto, isArray: true})
    @ApiBadRequestResponse({description: 'Некорректный ID лейбла', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл не найден', type: NotFoundResponseDto})
    findAllStatsByLabel(@Param('labelId', ParseIntPipe) labelId: number){
        return this.musicLabelService.findAllStatsByLabel(labelId);
    }

    @Get(':labelId/label-stats/:statId')
    @ApiOperation({summary: 'Получить запись статистики музыкального лейбла'})
    @ApiOkResponse({description: 'Запись статистики найдена', type: LabelStatResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл или запись статистики не найдены', type: NotFoundResponseDto})
    findOneStatByLabel(@Param('labelId', ParseIntPipe) labelId: number, @Param('statId', ParseIntPipe) statId: number){
        return this.musicLabelService.findOneStatByLabel(labelId, statId);  
    }

    @Post()
    @ApiOperation({summary: 'Создать музыкальный лейбл'})
    @ApiCreatedResponse({description: 'Музыкальный лейбл создан', type: MusicLabelResponseDto})
    @ApiBadRequestResponse({description: 'Некорректное тело запроса', type: BadRequestResponseDto})
    @ApiConflictResponse({description: 'Музыкальный лейбл с таким названием уже существует', type: ConflictResponseDto})
    create(@Body() createMusicLabelDto: CreateMusicLabelDto){
        return this.musicLabelService.create(createMusicLabelDto);
    }

    @Patch(':labelId')
    @ApiOperation({summary: 'Обновить музыкальный лейбл'})
    @ApiOkResponse({description: 'Музыкальный лейбл обновлён', type: MusicLabelResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID или тело запроса', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл не найден', type: NotFoundResponseDto})
    @ApiConflictResponse({description: 'Музыкальный лейбл с таким названием уже существует', type: ConflictResponseDto})
    update(@Param('labelId', ParseIntPipe) labelId: number, @Body() updateMusicLabelDto: UpdateMusicLabelDto){
        return this.musicLabelService.update(labelId, updateMusicLabelDto);
    }

    @Delete(':labelId')
    @ApiOperation({summary: 'Удалить музыкальный лейбл'})
    @ApiOkResponse({description: 'Музыкальный лейбл удалён', type: MusicLabelResponseDto})
    @ApiBadRequestResponse({description: 'Некорректный ID', type: BadRequestResponseDto})
    @ApiNotFoundResponse({description: 'Музыкальный лейбл не найден', type: NotFoundResponseDto})
    remove(@Param('labelId', ParseIntPipe) labelId: number){
        return this.musicLabelService.remove(labelId);
    }
}
