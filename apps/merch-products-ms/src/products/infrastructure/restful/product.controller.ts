import { Controller, Get, Param } from "@nestjs/common";
import { ProductApplication } from "../../application/product.application";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";

@Controller('products')
@ApiTags('Products')
export class ProductController {

    constructor(private readonly product: ProductApplication) { }

    @Get(':sku')
    @ApiOperation({ summary: 'Get product by SKU' })
    @ApiParam({ name: 'sku', description: 'Product SKU' })
    getBySku(@Param('sku') sku: string) {
        return this.product.findBySku(sku);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    getAll() {
        return this.product.findAll();
    }
    
}
