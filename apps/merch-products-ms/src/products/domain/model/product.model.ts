import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Product {

    @ApiProperty({ example: "ABC123", description: "The SKU of the product" })
    @IsNotEmpty()
    @IsString()
    sku: string;

    @ApiProperty({ example: "Judas Priest T-Shirt", description: "The name of the product" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: "A comfortable judas priest\'s t-shirt", description: "The description of the product" })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: "Clothing", description: "The category of the product" })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ example: 19.99, description: "The price of the product" })
    @IsPositive()
    price: number;

}