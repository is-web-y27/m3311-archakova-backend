import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMusicLabelDto } from './dto/create-music-label.dto';
import { UpdateMusicLabelDto } from './dto/update-music-label.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicLabel } from './entities/music-label.entity';
import { Repository } from 'typeorm';
@Injectable()
export class MusicLabelService {
  constructor(@InjectRepository(MusicLabel)
  private readonly musicLabelRepository: Repository<MusicLabel>,) {}
  create(createMusicLabelDto: CreateMusicLabelDto) {
    const musicLabel = this.musicLabelRepository.create(createMusicLabelDto);

    return this.musicLabelRepository.save(musicLabel);
  }

  findAll() {
    return this.musicLabelRepository.find();
  }

  async findOne(id: number) {
    const musicLabel = await this.musicLabelRepository.findOneBy({id});

    if (!musicLabel) {
      throw new NotFoundException(`Music label (id:${id}) not found.`);
    }
    return musicLabel;
  }

  async update(id: number, updateMusicLabelDto: UpdateMusicLabelDto) {
    const musicLabel = await this.findOne(id);
    Object.assign(musicLabel, updateMusicLabelDto);

    return this.musicLabelRepository.save(musicLabel);
  }

  async remove(id: number) {
    const musicLabel = await this.findOne(id);

    return this.musicLabelRepository.remove(musicLabel);
  }
}
