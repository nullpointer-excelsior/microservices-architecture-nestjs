import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsUUID } from "class-validator";

export class OrderCreatedResponse {

    @IsUUID()
    @ApiProperty({ example: "c7a8b9d0-1234-5678-9abc-def012345678", description: "The unique identifier of the order" })
    orderId: string;
    
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({ description: "The date and time when the order was created", example: "2021-08-01T12:00:00Z" })
    purchaseCreatedAt: Date;
}