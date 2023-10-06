import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


type SongProperties = {
    id: string
    name: string
    genre: string
    album: string
    artist: string
    trackUrl: string;
}
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
    
    static create(props: SongProperties) {
        const model = new SongModel()
        model.album = props.album
        model.artist = props.artist
        model.genre = props.genre
        model.id = props.id
        model.name = props.name
        model.trackUrl = props.trackUrl
        return model
    }

}