import { Product } from "../domain/model/product.model";

export abstract class ProductApplication {

    abstract findBySku(sku: string): Promise<Product>;

    abstract findAll(): Promise<Product[]>;

}
