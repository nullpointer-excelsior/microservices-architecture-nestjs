import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Song } from "./song";


export class Playlist {

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number

  @IsNotEmpty()
  songs: Song[];

}