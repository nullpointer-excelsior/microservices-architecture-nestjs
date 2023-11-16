import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class AlbumModel {

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the album' })
    id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The title of the album' })
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The photo of the album' })
    photo: string;

    @IsNumber()
    @ApiProperty({ description: 'The year the album was released' })
    year: number;

}