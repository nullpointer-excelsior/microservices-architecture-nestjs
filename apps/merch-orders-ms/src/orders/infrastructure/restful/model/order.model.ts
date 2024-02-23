import { IsArray, IsDate, IsIn, IsString, IsUUID, ValidateNested } from "class-validator";
import { OrderLine } from "./order-line.model";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
export class Order {

    @IsUUID()
    @ApiProperty({ example: "c7a8b9d0-1234-5678-9abc-def012345678", description: "The unique identifier of the order" })
    id: string;

    @IsString()
    @IsIn(['created', 'pending', 'completed'])
    @ApiProperty({ example: "created", description: "The status of the order" })
    status: string

    @IsDate()
    @ApiProperty({ example: "2022-01-01T12:00:00Z", description: "The timestamp of when the order was created" })
    createdAt: Date

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderLine)
    @ApiProperty({ type: [OrderLine], description: "The list of order lines" })
    lines: OrderLine[]

}