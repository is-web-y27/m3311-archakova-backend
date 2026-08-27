import { Module } from '@nestjs/common';
import { LabelStatService } from './label-stat.service';
import { LabelStatController } from './label-stat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicLabelModule } from 'src/music-label/music-label.module';
import { LabelStat } from './entities/label-stat.entity';
import { LabelStatPageController } from './label-stat-page.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LabelStat]), MusicLabelModule],
  controllers: [LabelStatController, LabelStatPageController],
  providers: [LabelStatService],
})
export class LabelStatModule {}
