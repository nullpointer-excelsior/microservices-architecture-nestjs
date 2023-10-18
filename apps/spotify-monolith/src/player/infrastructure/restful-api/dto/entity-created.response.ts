import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EntityCreatedResponse {

    constructor(id: string) {
        this.id = id
    }

    @IsString()
    @ApiProperty({ description: 'The created resource ID' })
    id: string;

}