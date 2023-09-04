import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { SharedModule } from '../../../libs/shared/src';
import { ProductRepository } from './product.repository';
// import { OpenTelemetryModule } from 'nestjs-otel';

// const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
//   metrics: {
//     hostMetrics: true, // Includes Host Metrics
//     apiMetrics: {
//       enable: true, // Includes api metrics
//       defaultAttributes: {
//         // You can set default labels for api metrics
//         custom: 'product-ms-label',
//       },
//       ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
//       ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
//     },
//   },
// });
@Module({
	imports: [SharedModule],
	controllers: [ProductController],
	providers: [ProductService, ProductRepository],
})
export class ProductsModule {}
