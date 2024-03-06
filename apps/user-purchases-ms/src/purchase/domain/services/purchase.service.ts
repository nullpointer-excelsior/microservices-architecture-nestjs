import { Injectable } from "@nestjs/common";
import { PurchaseRepository } from "../repositories/purchase.repository";
import { PurchaseStatus } from "../model/purchase-status";
import { SagaPurchase } from "../model/saga-purchase.model";

@Injectable()
export class PurchaseService {

    constructor(private readonly purchaseRepository: PurchaseRepository) { }

    async findByTransactionId(transactionId: string) {
        const purchase = await this.purchaseRepository.findByTransactionId(transactionId);
        if (!purchase) {
            throw new Error(`Purchase not found for transactionId: ${transactionId}`);
        }
        return purchase;
    }

    async updateStatus(transactionId: string, status: PurchaseStatus) {
        const purchase = await this.findByTransactionId(transactionId);
        purchase.status = status;
        return await this.purchaseRepository.save(purchase);
    }

    async save(purchase: SagaPurchase) {
        return await this.purchaseRepository.save(purchase);
    }

}