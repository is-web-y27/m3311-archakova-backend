import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicLabelService } from 'src/music-label/music-label.service';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm'; 

@Injectable()
export class ArtistService {
  constructor(@InjectRepository(Artist) private readonly artistRepository: Repository<Artist>, private readonly musicLabelService: MusicLabelService) {}
  async create(createArtistDto: CreateArtistDto) {
    const {labelId, ...artistData } = createArtistDto;

    const label = labelId ? await this.musicLabelService.findOne(Number(labelId)) : null;
    const artist = this.artistRepository.create({...artistData, label});
    return this.artistRepository.save(artist);
  }

  findAll() {
    return this.artistRepository.find({relations: {label:true}});
  }

  async findOne(id: number) {
    const artist = await this.artistRepository.findOne({where: {id}, relations: {label : true}});
    if (!artist){
      throw new NotFoundException(`Artist ${id} not found.`);
    }
    return artist;
  }

  async update(id: number, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);

    const {labelId, ...artistData} = updateArtistDto;

    Object.assign(artist, artistData);

    if (labelId !== undefined) {
      artist.label = labelId ? await this.musicLabelService.findOne(Number(labelId)) : null;
    }
    return this.artistRepository.save(artist);
  }

  async remove(id: number) {
    const artist = await this.findOne(id);
    return this.artistRepository.remove(artist);
  }
}
