import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserModel {

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'The ID of the user', required: false })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'The email address of the user' })
  email: string;

}