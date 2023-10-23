import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AlbumModel {

    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the album' })
    id: string;

    @IsString()
    @ApiProperty({ description: 'The title of the album' })
    title: string;

    @IsString()
    @ApiProperty({ description: 'The photo of the album' })
    photo: string;

    @IsNumber()
    @ApiProperty({ description: 'The year the album was released' })
    year: number;

}