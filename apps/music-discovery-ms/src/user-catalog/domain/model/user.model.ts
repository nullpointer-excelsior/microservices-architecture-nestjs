import { IsNotEmpty, IsString } from 'class-validator';
import { Model } from 'mongoose';

export class User extends Model{

  @IsNotEmpty()
  @IsString()
  username: string;

}