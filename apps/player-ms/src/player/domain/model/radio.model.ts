import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { GenreModel } from "./genre.model";
import { SongModel } from "./song.model";

export class RadioModel {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The ID of the radio' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the radio' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ type: [SongModel], description: 'The songs in the radio' })
  songs: SongModel[];

  @IsNotEmpty()
  @ApiProperty({ type: GenreModel, description: 'The genre of the radio' })
  genre: GenreModel;

}