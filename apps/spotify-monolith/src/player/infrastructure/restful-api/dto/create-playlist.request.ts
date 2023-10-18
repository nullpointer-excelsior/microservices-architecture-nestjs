import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreatePlayListRequest {
    
    @IsString()
    @ApiProperty({ description: 'The user ID' })
    userId: string
    
    @IsString()
    @ApiProperty({ description: 'The playlist name to save' })
    name: string;
    
    @IsArray()
    @ApiProperty({ description: 'Playlist Song IDs' })
    songIds: string[] 
    
}