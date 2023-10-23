import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ArtistModel {

  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the artist' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'The name of the artist' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'The photo of the artist' })
  photo: string;

  @IsString()
  @ApiProperty({ description: 'The biography of the artist' })
  biography: string;

}