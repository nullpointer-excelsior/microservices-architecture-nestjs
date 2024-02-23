import { OmitType } from "@nestjs/swagger";
import { Order } from "../../domain/model/order.model";

export class UpdateOrderStatusRequest extends OmitType(Order, ['createdAt', 'lines', 'customer']) {

}
