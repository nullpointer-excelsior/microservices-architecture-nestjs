import { Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { tracer } from './tracing';

const RETAIL_PRODUCTS = [
	{
		name: 'Camiseta básica',
		price: 15.99,
		description: 'Camiseta de algodón de corte clásico.',
	},
	{
		name: 'Vaqueros ajustados',
		price: 49.99,
		description: 'Vaqueros ajustados de color azul oscuro.',
	},
	{
		name: 'Zapatos deportivos',
		price: 79.99,
		description: 'Zapatos cómodos para actividades deportivas.',
	},
	{
		name: 'Bolso de cuero',
		price: 129.99,
		description: 'Bolso de cuero elegante con múltiples compartimentos.',
	},
	{
		name: 'Reloj de pulsera',
		price: 199.99,
		description: 'Reloj de pulsera resistente al agua con correa de acero.',
	},
	{
		name: 'Vestido de noche',
		price: 89.99,
		description: 'Vestido elegante para ocasiones especiales.',
	},
	{
		name: 'Cámara digital',
		price: 299.99,
		description: 'Cámara compacta de alta resolución para capturar momentos.',
	},
	{
		name: 'Tableta electrónica',
		price: 249.99,
		description: 'Tableta con pantalla táctil y capacidad de navegación.',
	},
	{
		name: 'Juego de sartenes antiadherentes',
		price: 69.99,
		description: 'Set de sartenes de cocina con revestimiento antiadherente.',
	},
	{
		name: 'Lámpara de pie',
		price: 59.99,
		description: 'Lámpara de pie con diseño moderno para iluminar tu hogar.',
	},
];

@Injectable()
export class ProductRepository {
	private readonly products: Product[] = RETAIL_PRODUCTS;

	constructor(
		@InjectPinoLogger(ProductRepository.name)
		private readonly logger: PinoLogger, // private readonly traceService: TraceService,
	) { }

	create(product: Product): Product {
		this.products.push(product);
		return product;
	}

	findAll(): Product[] {
		return tracer.startActiveSpan('products-repository.findAll()', (span) => {
			span.setAttributes({
				'component-service': 'ProductRepository',
				'method': 'findAll',
			})
			span.addEvent('start-db-query')
			const records = this.products;
			span.addEvent('end-db-query')
			span.end()
			return records
		})
	}

	update(id: number, updatedProduct: Product): Product {
		this.products[id] = updatedProduct;
		return updatedProduct;
	}

	delete(id: number): void {
		this.products.splice(id, 1);
	}
}
