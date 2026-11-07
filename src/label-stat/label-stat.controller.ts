import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res} from '@nestjs/common';
import { LabelStatService } from './label-stat.service';
import { CreateLabelStatDto } from './dto/create-label-stat.dto';
import { UpdateLabelStatDto } from './dto/update-label-stat.dto';
import type {Response} from 'express';
import { MusicLabelService } from 'src/music-label/music-label.service';

@Controller('label-stats')
export class LabelStatController {
  constructor(private readonly labelStatService: LabelStatService, private readonly musicLabelService: MusicLabelService) {}

  @Post()
  async create(@Body() createLabelStatDto: CreateLabelStatDto, @Res() res: Response) {
    const labelStat = await this.labelStatService.create(createLabelStatDto);
    return res.redirect(`/label-stats/${labelStat.id}`);
  }

  @Get()
  @Render('label-stats/list')
  async findAll() {
    const labelStats = await this.labelStatService.findAll();

    return { labelStats };
  }
  
  @Get('add')
  @Render('label-stats/add')
  async addForm(){
    const musicLabels = await this.musicLabelService.findAll();

    return {musicLabels};
  }

  @Get(':id/edit')
  @Render('label-stats/edit')
  async editForm(@Param('id') id: string){
    const labelStat = await this.labelStatService.findOne(+id);
    const musicLabels = await this.musicLabelService.findAll();
    const labelOptions = musicLabels.map((label) => ({id: label.id, name: label.name, selected: labelStat.label.id === label.id}));
    return {labelStat, labelOptions};
  }

  @Get(':id')
  @Render('label-stats/details')
  async findOne(@Param('id') id: string) {
    const labelStat = await this.labelStatService.findOne(+id);
    return { labelStat };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLabelStatDto: UpdateLabelStatDto, @Res() res: Response) {
    await this.labelStatService.update(+id, updateLabelStatDto);

    return res.redirect(`/label-stats/${id}`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.labelStatService.remove(+id);

    return res.redirect('/label-stats');
  }
}
