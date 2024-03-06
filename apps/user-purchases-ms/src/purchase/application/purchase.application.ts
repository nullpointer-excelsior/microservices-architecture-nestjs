import { CreatePurchaseRequest } from "./dto/create-purchase.dto";
import { PurchaseTransactionCreatedResponse } from "./dto/purchase-transaction-created.dto";

export abstract class PurchaseApplication {

    abstract startPurchaseProccess(dto: CreatePurchaseRequest): Promise<PurchaseTransactionCreatedResponse>
    
}