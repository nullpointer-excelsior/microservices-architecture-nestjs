import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class OrderCreatedResponse {

    @IsUUID()
    @ApiProperty({ example: "c7a8b9d0-1234-5678-9abc-def012345678", description: "The unique identifier of the order" })
    orderId: string;

    @IsUUID()
    @ApiProperty({ example: "c7a8b9d0-1234-5678-9abc-def012345678", description: "The unique identifier of the saga transaction" })
    transactionId: string;

}