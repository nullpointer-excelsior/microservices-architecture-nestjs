import { Injectable, Logger } from "@nestjs/common";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderStatusDto } from "../dto/update-order.dto";
import { Order } from "../../domain/model/order.model";
import { OrderApplication } from "../order.application";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { NotFoundExceptionIfUndefined } from "@lib/utils/decorators";
import { OrderStatus } from "../../domain/model/order-status.enum";

@Injectable()
export class OrderUseCases extends OrderApplication {

    private readonly logger = new Logger(OrderUseCases.name);

    constructor(private readonly repository: OrderRepository) {
        super();
    }
    
    async createOrder(dto: CreateOrderDto): Promise<Order> {
        const order = new Order();
        order.id = dto.id;
        order.status = OrderStatus.CREATED;
        order.createdAt = new Date();
        order.lines = dto.lines;
        await this.repository.create(order);
        this.logger.log(`Order created: ${order.id}`);
        return order;
    }

    async updateOrderStatus(dto: UpdateOrderStatusDto): Promise<Order> {
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