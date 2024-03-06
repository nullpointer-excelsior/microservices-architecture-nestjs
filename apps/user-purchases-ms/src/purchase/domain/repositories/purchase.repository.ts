import { PurchaseStatus } from "../model/purchase-status";
import { SagaPurchase } from "../model/saga-purchase.model";

export abstract class PurchaseRepository {
    abstract save(purchase: SagaPurchase): Promise<void>;
    abstract findByOrderId(orderId: string): Promise<SagaPurchase>;
    abstract findByTransactionId(orderId: string): Promise<SagaPurchase>;
    abstract updateStatusByOrderId(id: string, status: PurchaseStatus): Promise<void>;
}