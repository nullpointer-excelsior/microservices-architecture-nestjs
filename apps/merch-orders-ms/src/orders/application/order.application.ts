import { CreateOrderRequest } from "./dto/create-order-request.dto";
import { Order } from "../domain/model/order.model";
import { UpdateOrderStatusRequest } from "./dto/update-order-request.dto";

export abstract class OrderApplication {
    
    abstract createOrder(dto: CreateOrderRequest): Promise<Order>

    abstract updateOrderStatus(dto: UpdateOrderStatusRequest): Promise<Order>

}
