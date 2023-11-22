import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";
import { Song } from "./song.model";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


export class Radio {

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the radio' })
    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The name of the radio' })
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Song)
    @ApiProperty({ description: 'Songs of the radio', type:[Song] })
    songs: Song[]

    static create({ id, name, songs }: { id: string, name: string, songs: Song[]}) {
        const radio = new Radio()
        radio.id = id
        radio.name = name
        radio.songs = songs
        return radio
    }
    
    static updateSongs(radio: Radio, songs: Song[]): Radio {
        radio.songs = songs
        return radio
    }

}
