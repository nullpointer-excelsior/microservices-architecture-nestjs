import { Product } from "../model/product.model";

export abstract class ProductRepository {

    abstract findBySku(sku: string): Promise<Product>;
    abstract findAll(): Promise<Product[]>;

}