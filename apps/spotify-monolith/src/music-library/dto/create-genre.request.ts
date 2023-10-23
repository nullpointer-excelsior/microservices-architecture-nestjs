import { OmitType } from "@nestjs/swagger";
import { GenreModel } from "../model/genre.model";

export class CreateGenreRequest extends OmitType(GenreModel, ['id'] as const) { }