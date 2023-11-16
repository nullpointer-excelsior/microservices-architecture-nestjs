import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GenreModel {

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the genre' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the genre' })
  name: string;

}