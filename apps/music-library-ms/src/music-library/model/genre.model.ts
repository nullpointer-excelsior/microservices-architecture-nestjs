import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GenreModel {

  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the genre' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'The name of the genre' })
  name: string;

}