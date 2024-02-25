import { PickType } from "@nestjs/swagger";
import { Payment } from "../../domain/model/payment.model";

export class UpdatePaymentStatusRequest extends PickType(Payment, ['id', 'status']){
    
}