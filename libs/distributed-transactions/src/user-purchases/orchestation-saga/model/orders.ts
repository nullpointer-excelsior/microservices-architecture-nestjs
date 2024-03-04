import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsObject, IsPositive, IsUUID, ValidateNested } from "class-validator";
import { Customer } from "./customer";


export class OrderLine {
    
    @IsNotEmpty()
    sku: string;
    
    @IsPositive()
    quantity: number;

    @IsPositive()
    unitPrice: number;
    
}

export enum OrderStatus {
    CREATED = 'created',
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}


export class Order {

    @IsUUID()
    id: string;

    @IsObject()
    @ValidateNested()
    customer: Customer

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderLine)
    lines: OrderLine[]

}