import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { Order } from "../../domain/model/order.model";

@Injectable()
export class InMemoryOrderRepository extends OrderRepository {
    private orders: Order[] = [];

    create(order: Order): Promise<Order> {
        this.orders.push(order);
        return Promise.resolve(order);
    }

    update(order: Order): Promise<Order> {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
            this.orders[index] = order;
            return Promise.resolve(order);
        }
        return Promise.reject(new Error("Order not found."));
    }

    findById(id: string): Promise<Order> {
        const order = this.orders.find(o => o.id === id);
        if (order) {
            return Promise.resolve(order);
        }
        return Promise.resolve(undefined);
    }
}