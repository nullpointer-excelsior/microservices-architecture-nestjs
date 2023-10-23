import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UserModel {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The ID of the user' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The username of the user' })
  username: string;
  
}