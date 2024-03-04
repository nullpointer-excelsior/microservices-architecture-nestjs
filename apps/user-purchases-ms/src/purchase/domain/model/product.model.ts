import { IsNotEmpty, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class Product {
    
    @ApiProperty({ description: "SKU of the product", example: "ABC123" })
    @IsNotEmpty()
    sku: string;
    
    @ApiProperty({ description: "Quantity of the product", example: 10 })
    @IsPositive()
    quantity: number;

    @ApiProperty({ description: "Price of the product", example: 10800 })
    @IsPositive()
    unitPrice: number;
    
}