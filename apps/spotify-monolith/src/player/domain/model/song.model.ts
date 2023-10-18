import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class SongModel {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The ID of the song' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The title of the song' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The video of the song' })
  video: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The number of times the song has been played' })
  plays: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The duration of the song' })
  duration: number;

}