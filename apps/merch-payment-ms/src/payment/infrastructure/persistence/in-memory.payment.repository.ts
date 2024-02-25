import { Injectable } from "@nestjs/common";
import { Payment } from "../../domain/model/payment.model";
import { PaymentRepository } from "../../domain/repositories/payment.repository";

@Injectable()
export class InMemoryPaymentRepository extends PaymentRepository {
    
    private payments: Payment[];

    constructor() {
        super();
        this.payments = [];
    }

    async create(payment: Payment) {
        this.payments.push(payment);
        return payment;
    }
    
    async update(payment: Payment) {
        const index = this.payments.findIndex(p => p.id === payment.id);
        this.payments[index] = payment;
        return payment;
    }

    async findById(id: string) {
        return this.payments.find(p => p.id === id);
    }
}