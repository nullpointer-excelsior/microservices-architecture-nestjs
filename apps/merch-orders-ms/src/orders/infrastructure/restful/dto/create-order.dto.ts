import { OmitType } from "@nestjs/swagger";
import { Order } from "../model/order.model";

export class CreateOrderDto extends OmitType(Order, [ 'status', 'createdAt']) {

}
