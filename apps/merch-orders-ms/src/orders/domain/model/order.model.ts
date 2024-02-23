import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsObject, IsUUID, ValidateNested } from "class-validator";
import { Customer } from "./customer.model";
import { OrderLine } from "./order-line.model";
import { OrderStatus } from "./order-status.enum";
export class Order {

    @IsUUID()
    @ApiProperty({ example: "c7a8b9d0-1234-5678-9abc-def012345678", description: "The unique identifier of the order" })
    id: string;

    @IsEnum(OrderStatus)
    @ApiProperty({ example: "created", description: "The status of the order", enum: OrderStatus })
    status: OrderStatus

    @IsDate()
    @ApiProperty({ example: "2022-01-01T12:00:00Z", description: "The timestamp of when the order was created" })
    createdAt: Date

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