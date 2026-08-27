import { Module } from '@nestjs/common';
import { MusicLabelService } from './music-label.service';
import { MusicLabelController } from './music-label.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicLabel } from './entities/music-label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MusicLabel])],
  controllers: [MusicLabelController],
  providers: [MusicLabelService],
  exports: [MusicLabelService]
})
export class MusicLabelModule {}
