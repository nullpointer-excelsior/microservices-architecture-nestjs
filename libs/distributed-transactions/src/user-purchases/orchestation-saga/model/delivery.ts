import { IsDate, IsEnum, IsUUID } from "class-validator";

export enum DeliveryStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED',
    RETURNED = 'RETURNED'
}

export class Delivery {
    
    @IsUUID()
    id: string;

    @IsDate()
    estimatedDate: Date;

    @IsEnum(DeliveryStatus)
    status: DeliveryStatus;
    
}