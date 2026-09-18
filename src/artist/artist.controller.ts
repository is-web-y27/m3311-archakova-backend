import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import type { Response } from 'express';
import { MusicLabelService } from 'src/music-label/music-label.service';
import { Roles } from 'src/infrastructure/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user-role.enum';

@Roles(UserRole.ADMIN)
@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService, private readonly musicLabelService: MusicLabelService) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto, @Res() res: Response) {
    const artist = await this.artistService.create(createArtistDto);

    return res.redirect(`/artists/${artist.id}`);
  }

  @Get()
  @Render('artists/list')
  async findAll() {
    const artists = await this.artistService.findAll();

    return { artists }; 
  }

  @Get('add')
  @Render('artists/add')
  async addForm() {
    const musicLabels = await this.musicLabelService.findAll();

    return { musicLabels};
  }

  @Get(':id/edit')
  @Render('artists/edit')
  async editForm(
    @Param('id') id: string) {
      const artist = await this.artistService.findOne(+id);

      const musicLabels = await this.musicLabelService.findAll();

      const labelOptions = musicLabels.map((label) => ({id : label.id, name: label.name, selected: artist.label?.id === label.id,}));
      return {artist, labelOptions};
    }


  @Get(':id')
  @Render('artists/details')
  async findOne(@Param('id') id: string) {
    const artist = await this.artistService.findOne(+id);

    return{artist};
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto, @Res() res: Response) {
    await this.artistService.update(+id, updateArtistDto);

    return res.redirect(`/artists/${id}`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
      await this.artistService.remove(+id);

      return res.redirect('/artists');
  }
}
