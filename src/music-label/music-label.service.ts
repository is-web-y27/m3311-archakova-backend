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

  async findAllArtistsByLabel(labelId: number){
    const musicLabel = await this.musicLabelRepository.findOne({where: {id: labelId}, relations: {artists: true} });
    if (!musicLabel){
      throw new NotFoundException(`Music label ${labelId} not found`);
    }

    return musicLabel?.artists;
  }

  async findOneArtistByLabel(artistId: number, labelId: number){
    const musicLabel = await this.musicLabelRepository.findOne({where: {id: labelId}, relations: {artists: true}});
    if(!musicLabel){
      throw new NotFoundException(`Music label ${labelId} not found`);
    
    }

    const artist = musicLabel.artists.find((artist) => artist.id === artistId) ;

    if (!artist){
      throw new NotFoundException(`Artist ${artistId} associated with the label ${labelId} not found`);
    }

    return artist;
  }

  async findAllStatsByLabel(labelId: number){
    const musicLabel = await this.musicLabelRepository.findOne({where: {id: labelId}, relations: {stats: true}});

    if (!musicLabel){
      throw new NotFoundException(`Music label ${labelId} not found`);
    }
    return musicLabel.stats;
  }

  async findOneStatByLabel(labelId: number, statId: number){
    const musicLabel = await this.musicLabelRepository.findOne({where: {id: labelId}, relations: {stats: true}});

    if (!musicLabel){
      throw new NotFoundException(`Music label ${labelId} not found`);
    
    }

    const stat = musicLabel.stats.find((stat) => stat.id === statId);

    if (!stat){
      throw new NotFoundException(`Stat ${statId} associated with the label ${labelId} not found`);
    }

    return stat;
  }

  findAll() {
    return this.musicLabelRepository.find();
  }

  async findOne(id: number) {
    const musicLabel = await this.musicLabelRepository.findOneBy({id});

    if (!musicLabel) {
      throw new NotFoundException(`Music label ${id} not found.`);
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

  async findPage(page: number, limit: number){
    const [items, total] = await this.musicLabelRepository.findAndCount({order: {id: 'ASC'}, skip: (page-1)*limit, take: limit});

    return {items, total};
  }
}
