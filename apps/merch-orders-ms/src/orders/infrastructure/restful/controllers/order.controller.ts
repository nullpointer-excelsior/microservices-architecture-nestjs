import { Body, Controller, Patch, Post } from "@nestjs/common";
import { CreateOrderDto } from "../../../application/dto/create-order.dto";
import { UpdateOrderStatusDto } from "../../../application/dto/update-order.dto";
import { OrderApplication } from "../../../application/order.application";
import { ApiTags, ApiOperation, ApiResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { Order } from "../../../domain/model/order.model";
import { HttpExceptionBody } from "../dto/http-exception-body.dto";

@Controller('orders')
@ApiTags('Orders')
export class OrderController {

    constructor(private readonly order: OrderApplication) {}

    @Post()
    @ApiOperation({ summary: 'Create an order' })
    @ApiResponse({ status: 201, description: 'The order has been successfully created.', type: Order })
    createOrder(@Body() dto: CreateOrderDto) {
        return this.order.createOrder(dto);
    }

    @Patch('status')
    @ApiOperation({ summary: 'Update order status' })
    @ApiResponse({ status: 200, description: 'The order status has been successfully updated.', type: Order })
    @ApiNotFoundResponse({ description: 'Order not found in database', type: HttpExceptionBody })
    updateOrderStatus(@Body() dto: UpdateOrderStatusDto) {
        return this.order.updateOrderStatus(dto);
    }
}