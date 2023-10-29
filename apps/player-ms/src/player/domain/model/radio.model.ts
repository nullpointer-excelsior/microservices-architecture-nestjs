import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RadioModel {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The ID of the radio' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the radio' })
  name: string;

}