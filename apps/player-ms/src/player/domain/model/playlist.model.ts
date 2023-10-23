import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { SongModel } from "./song.model";


export class PlaylistModel {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The ID of the playlist' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the playlist' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The duration of the playlist' })
  duration: number

  @IsNotEmpty()
  @ApiProperty({ type: [SongModel], description: 'The songs in the playlist' })
  songs: SongModel[];

}