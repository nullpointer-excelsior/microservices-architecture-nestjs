import { Injectable } from "@nestjs/common";
import { PurchaseStatus } from "../../domain/model/purchase-status";
import { Purchase } from "../../domain/model/purchase.model";
import { PurchaseRepository } from "../../domain/repositories/purchase.repository";

@Injectable()
export class InMemoryPurchaseRepostiory extends PurchaseRepository {

    private purchases: Purchase[];

    constructor() {
        super();
        this.purchases = [];
    }
    
    async save(purchase) {
        this.purchases.push(purchase);
    }
    
    async findByOrderId(orderId: string) {
        return this.purchases.find(p => p.orderId === orderId);
    }

    async updateStatusByOrderId(orderId: string, status: PurchaseStatus) {
        const purchase = this.purchases.find(p => p.orderId === orderId);
        purchase.status = status;
        for (let i = 0; i < this.purchases.length; i++) {
            if (this.purchases[i].orderId === orderId) {
                this.purchases[i] = purchase;
                break;
            }
        }
    }
}