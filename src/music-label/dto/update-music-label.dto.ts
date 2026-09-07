import { PartialType } from '@nestjs/swagger';
import { CreateMusicLabelDto } from './create-music-label.dto';

export class UpdateMusicLabelDto extends PartialType(CreateMusicLabelDto) {}
