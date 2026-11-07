import { CreateArtistInput } from './create-artist.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArtistInput extends PartialType(CreateArtistInput) {}
