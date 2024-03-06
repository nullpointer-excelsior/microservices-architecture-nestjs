import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class PurchaseTransactionCreatedResponse {

    @IsUUID()
    @ApiProperty({ example: "c7a8b9d0-1234-5678-9abc-def012345678", description: "The unique identifier of the purchase transaction" })
    transactionId: string;

}