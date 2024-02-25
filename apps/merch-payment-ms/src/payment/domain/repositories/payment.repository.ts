import { Payment } from "../model/payment.model";

export abstract class PaymentRepository {
    abstract create(payment: Payment): Promise<Payment>
    abstract update(payment: Payment): Promise<Payment>
    abstract findById(id: string): Promise<Payment>
}