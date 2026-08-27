import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { MusicLabelModule } from '../music-label/music-label.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Artist]), MusicLabelModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
