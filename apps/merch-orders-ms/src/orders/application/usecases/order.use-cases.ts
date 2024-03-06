import { NotFoundExceptionIfUndefined } from "@lib/utils/decorators";
import { generateUUID } from "@lib/utils/seedwork";
import { Injectable, Logger } from "@nestjs/common";
import { OrderStatus } from "../../domain/model/order-status.enum";
import { Order } from "../../domain/model/order.model";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { CreateOrderRequest } from "../dto/create-order-request.dto";
import { UpdateOrderStatusRequest } from "../dto/update-order-request.dto";
import { OrderApplication } from "../order.application";

@Injectable()
export class OrderUseCases extends OrderApplication {

    private readonly logger = new Logger(OrderUseCases.name);

    constructor(private readonly repository: OrderRepository) {
        super();
    }
    
    async createOrder(dto: CreateOrderRequest): Promise<Order> {
        const order = new Order();
        order.id = generateUUID()
        order.status = OrderStatus.CREATED;
        order.createdAt = new Date();
        order.lines = dto.lines;
        order.customer = dto.customer;
        await this.repository.create(order);
        this.logger.log(`Order created: ${order.id}`);
        return order;
    }

    async updateOrderStatus(dto: UpdateOrderStatusRequest): Promise<Order> {
        const order = await this.findOrderById(dto.id);
        order.status = dto.status;
        await this.repository.update(order);
        this.logger.log(`Order updated: ${order.id} to state: ${order.status}`);
        return order;
    }

    @NotFoundExceptionIfUndefined('Order not found in database')
    private findOrderById(id: string): Promise<Order> {
        return this.repository.findById(id);
    }

}