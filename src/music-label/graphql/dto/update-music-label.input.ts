import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMusicLabelInput } from './create-music-label.input';

@InputType()
export class UpdateMusicLabelInput extends PartialType(CreateMusicLabelInput) {}
