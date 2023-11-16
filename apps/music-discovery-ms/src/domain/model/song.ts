import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class Song {

  @IsNotEmpty()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  video: string;

  @IsString()
  audio: string;

  @IsNumber()
  plays: number;

  @IsNumber()
  duration: number;

  @IsNotEmpty()
  artistId: string;

  @IsString()
  artistName: string;

  @IsNotEmpty()
  albumId: string;
  
  @IsString()
  albumTitle: string;

  @IsNotEmpty()
  genreId: string;

  @IsString()
  genreName: string;
  
}
