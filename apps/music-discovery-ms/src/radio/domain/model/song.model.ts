import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class Song {

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the song' })
    id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The title of the song' })
    title: string;

    @IsString()
    @ApiProperty({ description: 'The artist name of the song' })
    artist: string
    
    @IsString()
    @ApiProperty({ description: 'The album name of the song' })
    album: string

    @IsString()
    @ApiProperty({ description: 'The genre of the song' })
    genre: string

    static create({id, title, artist, album, genre }: { id: string, title: string, artist: string, album: string, genre: string }){
        const song = new Song()
        song.id = id
        song.title = title
        song.album = album
        song.artist = artist
        song.genre = genre
        return song
    }

}
