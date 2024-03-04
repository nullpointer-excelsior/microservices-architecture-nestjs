import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsObject, IsUUID, ValidateNested } from "class-validator";
import { Customer } from "./customer.model";
import { Product } from "./product.model";
import { PurchaseStatus } from "./purchase-status";

export class Purchase {
    
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsObject()
    @ValidateNested()
    customer: Customer

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Product)
    products: Product[]

    @IsEnum(PurchaseStatus)
    status: PurchaseStatus

    @IsUUID()
    @IsNotEmpty()
    orderId: string

}