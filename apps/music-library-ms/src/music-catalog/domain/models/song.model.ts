import { IsNotEmpty, IsString, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Song {

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the song' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The title of the song' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'The video of the song' })
  video: string;
  
  @IsString()
  @ApiProperty({ description: 'S3 storage object name' })
  storage: string;

  @IsPositive()
  @IsNumber()
  @ApiProperty({ description: 'The number of times the song has been played' })
  plays: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'The duration of the song in seconds' })
  duration: number;

}