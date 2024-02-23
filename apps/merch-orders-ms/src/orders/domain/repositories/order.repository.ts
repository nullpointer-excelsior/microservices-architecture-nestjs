import { Order } from "../../infrastructure/restful/model/order.model";

export abstract class OrderRepository {
    abstract create(order: Order): Promise<Order>;
    abstract update(order: Order): Promise<Order>;
    abstract findById(id: string): Promise<Order | undefined>;
}