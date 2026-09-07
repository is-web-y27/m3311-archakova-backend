import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { MusicLabelModule } from '../music-label/music-label.module';
import { ArtistApiController } from './artist-api.controller';

@Module({
  imports: [ TypeOrmModule.forFeature([Artist]), MusicLabelModule],
  controllers: [ArtistController, ArtistApiController],
  providers: [ArtistService],
  exports: [ArtistService, MusicLabelModule],
})
export class ArtistModule {}
