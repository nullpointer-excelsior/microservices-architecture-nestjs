import { IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Customer {
    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", description: "The unique identifier of the customer" })
    @IsUUID()
    id: string;

    @ApiProperty({ example: "John Doe", description: "The full name of the customer" })
    @IsString()
    fullname: string;

    @ApiProperty({ example: "johndoe@example.com", description: "The email address of the customer" })
    @IsString()
    email: string;

    @ApiProperty({ example: "123 Main St", description: "The address of the customer" })
    @IsString()
    address: string;

    @ApiProperty({ example: "New York", description: "The city of the customer" })
    @IsString()
    city: string;

    @ApiProperty({ example: "United States", description: "The country of the customer" })
    @IsString()
    country: string;

}