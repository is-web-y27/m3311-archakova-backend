import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Render, Res } from '@nestjs/common';
import { MusicLabelService } from './music-label.service';
import { CreateMusicLabelDto } from './dto/create-music-label.dto';
import { UpdateMusicLabelDto } from './dto/update-music-label.dto';
import type { Response } from 'express';
import { Roles } from 'src/infrastructure/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user-role.enum';

@Roles(UserRole.ADMIN)
@Controller('music-labels')
export class MusicLabelController {
  constructor(private readonly musicLabelService: MusicLabelService) {}

  @Post()
  async create(@Body() createMusicLabelDto: CreateMusicLabelDto, @Res() res: Response,) {
    const musicLabel = await this.musicLabelService.create(createMusicLabelDto);
    return res.redirect(`/music-labels/${musicLabel.id}`);
  }

  @Get()
  @Render('music-labels/list')
  async findAll() {
    const musicLabels = await this.musicLabelService.findAll();

    return { title: 'Музыльканые лейблы:', musicLabels };
  }

  @Get('add')
  @Render('music-labels/add')
  showAddForm() {
    return { title: 'Добавить музыкальный лейбл'
    };
  }

  @Get(':id/edit')
  @Render('music-labels/edit')
  async editForm(@Param('id') id: string,) {
    const musicLabel = await this.musicLabelService.findOne(+id);

    return {musicLabel};
  }

  @Get(':id')
  @Render('music-labels/details')
  async findOne(@Param('id') id: string) {
    const musicLabel = await this.musicLabelService.findOne(+id);
    return {musicLabel};
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMusicLabelDto: UpdateMusicLabelDto, @Res() res: Response) {
    await this.musicLabelService.update(+id, updateMusicLabelDto);
    return res.redirect(`/music-labels/${id}`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.musicLabelService.remove(+id);
    return res.redirect('/music-labels');
  }
}
