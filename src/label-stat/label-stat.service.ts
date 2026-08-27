import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabelStatDto } from './dto/create-label-stat.dto';
import { UpdateLabelStatDto } from './dto/update-label-stat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicLabelService } from 'src/music-label/music-label.service';
import { LabelStat } from './entities/label-stat.entity';

@Injectable()
export class LabelStatService {
  constructor(@InjectRepository(LabelStat) private readonly labelStatRepository: Repository<LabelStat>, private readonly musicLabelService: MusicLabelService) {}
  async create(createLabelStatDto: CreateLabelStatDto) {
    const { labelId, year, marketShare, ...statData} = createLabelStatDto;
    if (!labelId) {
      throw new BadRequestException('There must be a Music Label');
    }

    const parsedYear = Number(year);

    if (Number.isNaN(parsedYear)) {
      throw new BadRequestException('The year must be a number.');
    }
    const label = await this.musicLabelService.findOne(Number(labelId));
    const labelStat = this.labelStatRepository.create({...statData, label, year: parsedYear, marketShare: marketShare?.trim() ? marketShare : null});
    return this.labelStatRepository.save(labelStat);
  }

  findAll() {
    return this.labelStatRepository.find({relations: {label: true}, order: {year: 'DESC'}});
  }

  async findOne(id: number) {
    const labelStat = await this.labelStatRepository.findOne({where: {id}, relations: {label: true}});
    if (!labelStat) {
      throw new NotFoundException(`Label stat ${id} not found.`);
    }
    return labelStat;
  }

  async update(id: number, updateLabelStatDto: UpdateLabelStatDto) {
    const labelStat = await this.findOne(id);

    const { labelId, year, marketShare, ...statData} = updateLabelStatDto;

    Object.assign(labelStat, statData);
    if (labelId !== undefined){
      if (!labelId){
        throw new BadRequestException('There must be a Music Label.');
      }

      labelStat.label = await this.musicLabelService.findOne(Number(labelId));
    }

    if (year !== undefined){
      const parsedYear = Number(year);
      if (Number.isNaN(parsedYear)) {
        throw new BadRequestException('The year must be a number.');
      }
      labelStat.year = parsedYear;
    }
    if (marketShare !== undefined) {
      labelStat.marketShare = marketShare.trim() ? marketShare: null;
      return this.labelStatRepository.save(labelStat);
    }
  }

  async remove(id: number) {
    const labelStat = await this.findOne(id);
    return this.labelStatRepository.remove(labelStat); 
  }
}
