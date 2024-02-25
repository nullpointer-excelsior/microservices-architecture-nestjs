import { OmitType } from "@nestjs/swagger";
import { Payment } from "../../domain/model/payment.model";

export class CreatePaymentRequest extends OmitType(Payment, ['status', 'id', 'createdAt'] as const) {}