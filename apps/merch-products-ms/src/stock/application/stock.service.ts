import { Injectable } from "@nestjs/common";

@Injectable()
export class StockUseCases {

    private fakeStockLimit = 10;

    async updateStock(sku: string, quantity: number): Promise<void> {
        if (quantity > this.fakeStockLimit) {
            throw new Error(`Stock limit exceeded for product with sku: ${sku}`);
        }
    }
}