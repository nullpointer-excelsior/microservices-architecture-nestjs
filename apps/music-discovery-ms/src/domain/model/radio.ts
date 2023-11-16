import { IsNotEmpty, IsString, IsArray } from "class-validator";
import { Playlist } from "./playlist";

export class Radio {
    
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    playlist: Playlist[]

}