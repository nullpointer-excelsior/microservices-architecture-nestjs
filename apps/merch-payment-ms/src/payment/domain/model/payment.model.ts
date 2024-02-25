import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsObject, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";
import { Customer } from "./customer.model";
import { PaymentStatus } from "./payment-status.enum";

export class Payment {
    
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851', description: 'The unique identifier of the payment' })
    id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851', description: 'The unique identifier of the order' })
    orderId: string;

    @ValidateNested()
    @IsObject()
    @ApiProperty({ type: Customer, description: 'The customer information' })
    customer: Customer;

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty({ example: 100, description: 'The total amount of the payment' })
    totalAmount: number;

    @IsString()
    @IsEnum(PaymentStatus)
    @ApiProperty({ example: PaymentStatus.PENDING, description: 'The status of the payment', enum: PaymentStatus })
    status: PaymentStatus;

    @IsDate()
    @ApiProperty({ example: "2022-01-01T12:00:00Z", description: "The timestamp of when the payment was created" })
    createdAt: Date
}