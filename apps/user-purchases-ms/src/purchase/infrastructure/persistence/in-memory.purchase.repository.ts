import { Injectable } from "@nestjs/common";
import { PurchaseStatus } from "../../domain/model/purchase-status";
import { SagaPurchase } from "../../domain/model/saga-purchase.model";
import { PurchaseRepository } from "../../domain/repositories/purchase.repository";

@Injectable()
export class InMemoryPurchaseRepostiory extends PurchaseRepository {

    private purchases: SagaPurchase[];

    constructor() {
        super();
        this.purchases = [];
    }
    
    async save(purchase) {
         if (this.purchases.find(p => p.transactionId === purchase.transactionId) === undefined) {
             this.purchases.push(purchase);
         } else {
                for (let i = 0; i < this.purchases.length; i++) {
                    if (this.purchases[i].transactionId === purchase.transactionId) {
                        this.purchases[i] = purchase;
                        break;
                    }
                }
            }
    }
    
    async findByOrderId(orderId: string) {
        return this.purchases.find(p => p.order.id === orderId);
    }

    async findByTransactionId(transactionId: string) {
        return this.purchases.find(p => p.transactionId === transactionId);
    }

    async updateStatusByOrderId(orderId: string, status: PurchaseStatus) {
        const purchase = this.purchases.find(p => p.order.id === orderId);
        purchase.status = status;
        for (let i = 0; i < this.purchases.length; i++) {
            if (this.purchases[i].order.id === orderId) {
                this.purchases[i] = purchase;
                break;
            }
        }
    }
}