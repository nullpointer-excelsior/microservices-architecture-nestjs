import { OmitType } from "@nestjs/swagger";
import { Order } from "../../domain/model/order.model";

export class CreatePurchaseRequest extends OmitType(Order, ['id']) {}