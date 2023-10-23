import { OmitType } from "@nestjs/swagger";
import { ArtistModel } from "../model/artist.model";

export class CreateArtistRequest extends OmitType(ArtistModel, ['id'] as const) { }