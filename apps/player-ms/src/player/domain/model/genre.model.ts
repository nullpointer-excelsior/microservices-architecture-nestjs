import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GenreModel {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The ID of the genre' })
    id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The name of the genre' })
    name: string;

}