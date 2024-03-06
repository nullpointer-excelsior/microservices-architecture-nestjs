import { IsEnum, IsNotEmpty, IsObject, IsUUID, ValidateNested } from "class-validator";
import { Order } from "./order.model";
import { PurchaseStatus } from "./purchase-status";

export class SagaPurchase {
    
    @IsUUID()
    @IsNotEmpty()
    transactionId: string;

    @IsObject()
    @ValidateNested()
    order: Order;

    @IsEnum(PurchaseStatus)
    status: PurchaseStatus

}