import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/restful/product.controller';
import { InMemoryProductRepository } from './infrastructure/persistence/in-memory.product.repository';
import { ProductRepository } from './domain/repositories/product.repository';
import { ProductUseCases } from './application/usecases/product.use-cases';
import { ProductApplication } from './application/product.application';

@Module({
    imports:[],
    controllers:[
        ProductController
    ],
    providers:[
        InMemoryProductRepository,
        ProductUseCases,
        {
            provide: ProductRepository,
            useExisting: InMemoryProductRepository
        },
        {
            provide: ProductApplication,
            useExisting: ProductUseCases
        }
    ]
})
export class ProductsModule {}
