import { Module } from '@nestjs/common';
import { MusicLabelService } from './music-label.service';
import { MusicLabelController } from './music-label.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicLabel } from './entities/music-label.entity';
import { MusicLabelApiController } from './music-label-api.controller';
import { MusicLabelResolver } from './graphql/music-label.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MusicLabel])],
  controllers: [MusicLabelController, MusicLabelApiController],
  providers: [MusicLabelService, MusicLabelResolver],
  exports: [MusicLabelService]
})
export class MusicLabelModule {}
