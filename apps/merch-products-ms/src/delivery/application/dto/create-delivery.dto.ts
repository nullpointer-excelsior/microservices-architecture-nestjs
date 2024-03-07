import { IsObject, ValidateNested } from "class-validator";
import { Order } from "../../domain/model/order.model";

export class CreateDeliveryDto {
    
    @IsObject()
    @ValidateNested()
    order: Order;
    
}