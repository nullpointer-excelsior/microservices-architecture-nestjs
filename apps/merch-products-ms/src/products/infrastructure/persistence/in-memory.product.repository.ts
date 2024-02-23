import { Injectable } from "@nestjs/common";
import { Product } from "../../domain/model/product.model";
import { ProductRepository } from "../../domain/repositories/product.repository";

@Injectable()
export class InMemoryProductRepository extends ProductRepository {

    private products: Product[] = [
        {
            sku: '001',
            name: 'AC/DC T-Shirt',
            description: 'T-Shirt with logo of AC/DC',
            category: 'Rock',
            price: 2500
        },
        {
            sku: '002',
            name: 'Metallica Hoodie',
            description: 'Hoodie with logo of Metallica',
            category: 'Metal',
            price: 4500
        },
        {
            sku: '003',
            name: 'Guns N\' Roses Poster',
            description: 'Poster featuring Guns N\' Roses',
            category: 'Rock',
            price: 1500
        },
        {
            sku: '004',
            name: 'Iron Maiden Patch',
            description: 'Embroidered patch of Iron Maiden',
            category: 'Metal',
            price: 500
        },
        {
            sku: '005',
            name: 'Led Zeppelin Mug',
            description: 'Coffee mug with artwork of Led Zeppelin',
            category: 'Rock',
            price: 1000
        },
        {
            sku: '006',
            name: 'Black Sabbath Keychain',
            description: 'Keychain featuring the logo of Black Sabbath',
            category: 'Metal',
            price: 300
        },
        {
            sku: '007',
            name: 'Queen Cap',
            description: 'Baseball cap with the emblem of Queen',
            category: 'Rock',
            price: 2000
        },
        {
            sku: '008',
            name: 'Judas Priest Vinyl',
            description: 'Limited edition vinyl record of Judas Priest',
            category: 'Metal',
            price: 6000
        },
        {
            sku: '009',
            name: 'The Rolling Stones Necklace',
            description: 'Necklace with pendant of The Rolling Stones logo',
            category: 'Rock',
            price: 3500
        },
        {
            sku: '010',
            name: 'Slipknot Sticker',
            description: 'Sticker featuring the artwork of Slipknot',
            category: 'Metal',
            price: 100
        }
    ];

    async findBySku(sku: string): Promise<Product> {
        return this.products.find(product => product.sku === sku);
    }

    async findAll(): Promise<Product[]> {
        return this.products;
    }

}