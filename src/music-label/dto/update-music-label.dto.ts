import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicLabelDto } from './create-music-label.dto';

export class UpdateMusicLabelDto extends PartialType(CreateMusicLabelDto) {}
