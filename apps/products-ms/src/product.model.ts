import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Product {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number
}
