import { NotFoundExceptionIfUndefined } from "@lib/utils/decorators";
import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductApplication } from "../product.application";
import { Product } from "../../domain/model/product.model";

@Injectable()
export class ProductUseCases extends ProductApplication {

    constructor(private productRepository: ProductRepository) { super() }

    @NotFoundExceptionIfUndefined('Product not found')
    async findBySku(sku: string): Promise<Product> {
        return this.productRepository.findBySku(sku);
    }

    findAll(): Promise<Product[]> {
        return this.productRepository.findAll();
    }

}
