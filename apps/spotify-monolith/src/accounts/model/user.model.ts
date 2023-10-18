import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserModel {

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: 'The ID of the user', required: false })
  id?: string;

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

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Whether the user has a premium account' })
  premium: boolean;

}