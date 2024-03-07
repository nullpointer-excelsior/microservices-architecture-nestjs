import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class StockUseCases {

    private readonly logger = new Logger(StockUseCases.name)

    private fakeStockLimit = 10;

    async reduceStock(sku: string, quantity: number): Promise<void> {
        if (quantity > this.fakeStockLimit) {
            throw new Error(`Stock limit exceeded for product with sku: ${sku}`);
        }
    }

    async incrementStock(sku: string, quantity: number): Promise<void> {
       this.logger.log(`Stock added for sku: ${sku} quantity: ${quantity}`);
    }
}