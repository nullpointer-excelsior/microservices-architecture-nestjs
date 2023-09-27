import { IsNotEmpty, IsString } from "class-validator";

export class SongModel {
    @IsNotEmpty()
    @IsString()
    id: string;
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    genre: string;
    @IsNotEmpty()
    @IsString()
    album: string;
    @IsNotEmpty()
    @IsString()
    artist: string;
    @IsNotEmpty()
    @IsString()
    trackUrl: string;
    
}