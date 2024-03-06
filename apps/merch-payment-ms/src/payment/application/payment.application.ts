import { Payment } from "../domain/model/payment.model";
import { CreatePaymentRequest } from "./dto/create-payment-request.dto";
import { UpdatePaymentStatusRequest } from "./dto/update-payment-status-request.dto";

export abstract class PaymentApplication {
    abstract createPayment(dto: CreatePaymentRequest): Promise<Payment>
    abstract processPayment(payment: Payment): Promise<Payment>
    abstract updatePaymentStatus(dto: UpdatePaymentStatusRequest): Promise<Payment>
}