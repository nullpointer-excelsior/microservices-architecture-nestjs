import { PurchaseStatus } from "../model/purchase-status";
import { Purchase } from "../model/purchase.model";

export abstract class PurchaseRepository {
    abstract save(purchase: Purchase): Promise<void>;
    abstract findByOrderId(orderId: string): Promise<Purchase>;
    abstract updateStatusByOrderId(id: string, status: PurchaseStatus): Promise<void>;
}