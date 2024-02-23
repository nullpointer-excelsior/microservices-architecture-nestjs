import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "../domain/model/order.model";
import { UpdateOrderStatusDto } from "./dto/update-order.dto";

export abstract class OrderApplication {
    
    abstract createOrder(dto: CreateOrderDto): Promise<Order>

    abstract updateOrderStatus(dto: UpdateOrderStatusDto): Promise<Order>

}
