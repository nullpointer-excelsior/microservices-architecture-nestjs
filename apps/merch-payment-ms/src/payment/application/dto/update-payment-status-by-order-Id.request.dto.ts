import { PickType } from "@nestjs/swagger";
import { Payment } from "../../domain/model/payment.model";
import { IsUUID } from "class-validator";

export class UpdatePaymentStatusByOrderIdRequest extends PickType(Payment, ['status']){
    @IsUUID()
    orderId: string;
}