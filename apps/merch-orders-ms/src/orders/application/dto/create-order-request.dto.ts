import { OmitType } from "@nestjs/swagger";
import { Order } from "../../domain/model/order.model";

export class CreateOrderRequest extends OmitType(Order, ['id', 'status', 'createdAt']) {

}
