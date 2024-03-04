import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsObject, IsUUID, ValidateNested } from "class-validator";
import { Customer } from "./customer.model";
import { OrderLine } from "./order-line.model";

export class Order {

    @IsUUID()
    @ApiProperty({ example: "c7a8b9d0-1234-5678-9abc-def012345678", description: "The unique identifier of the order" })
    id: string;

    @IsObject()
    @ValidateNested()
    @ApiProperty({ type: Customer, description: "The customer who placed the order" })
    customer: Customer

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderLine)
    @ApiProperty({ type: [OrderLine], description: "The list of order lines" })
    lines: OrderLine[]

}