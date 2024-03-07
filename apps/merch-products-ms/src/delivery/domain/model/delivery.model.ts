import { IsDate, IsEnum, IsUUID } from "class-validator";
import { DeliveryStatus } from "./delivery.status";

export class Delivery {
    
    @IsUUID()
    id: string;

    @IsDate()
    estimatedDate: Date;

    @IsEnum(DeliveryStatus)
    status: DeliveryStatus;
    
}