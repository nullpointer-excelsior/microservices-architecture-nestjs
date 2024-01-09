import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class Artist {

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the artist' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the artist' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The photo of the artist' })
  photo: string;

  @IsString()
  @ApiProperty({ description: 'The biography of the artist' })
  biography: string;

}