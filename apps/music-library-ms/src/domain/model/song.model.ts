import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SongModel {
    @ApiProperty({ description: 'Id song'})
    @IsNotEmpty()
    @IsString()
    id: string;
    @ApiProperty({ example: "Runaway"})
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiProperty({ example: "Glam Rock"})
    @IsNotEmpty()
    @IsString()
    genre: string;
    @ApiProperty({ example: "Runaway"})
    @IsNotEmpty()
    @IsString()
    album: string;
    @ApiProperty({ example: "Bon Jovi"})
    @IsNotEmpty()
    @IsString()
    artist: string;
    @ApiProperty({ example: "http://music.com/7jdhyds737"})
    @IsNotEmpty()
    @IsString()
    trackUrl: string;
    
}