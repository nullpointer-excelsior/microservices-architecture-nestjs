import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SongModel {

  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the song' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'The title of the song' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'The video of the song' })
  video: string;

  @IsNumber()
  @ApiProperty({ description: 'The number of times the song has been played' })
  plays: number;

  @IsNumber()
  @ApiProperty({ description: 'The duration of the song in seconds' })
  duration: number;

}