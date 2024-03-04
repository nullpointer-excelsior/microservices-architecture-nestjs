import { CreatePurchaseRequest } from "./dto/create-purchase.dto";
import { OrderCreatedResponse } from "./dto/order-created.dto";

export abstract class PurchaseApplication {

    abstract startPurchaseProccess(dto: CreatePurchaseRequest): Promise<OrderCreatedResponse>
    
}