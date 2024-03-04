import { SagaExecutorService } from "@lib/distributed-transactions/user-purchases";
import { NotFoundExceptionIfUndefined } from "@lib/utils/decorators";
import { EventEmitterEventbus, Model } from "@lib/utils/seedwork";
import { Injectable } from "@nestjs/common";
import { PaymentStatus } from "../../domain/model/payment-status.enum";
import { Payment } from "../../domain/model/payment.model";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import { CreatePaymentRequest } from "../dto/create-payment-request.dto";
import { UpdatePaymentStatusRequest } from "../dto/update-payment-status-request.dto";
import { PaymentApplication } from "../payment.application";
import { PaymentStatusUpdatedEvent } from "../../domain/events/payment-status-updated.event";
import { UpdatePaymentStatusByOrderIdRequest } from "../dto/update-payment-status-by-order-Id.request.dto";

@Injectable()
export class PaymentUseCases extends PaymentApplication {
    
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly sagaExecutor: SagaExecutorService,
        private readonly domainEventbus: EventEmitterEventbus
    ) {
        super();
    }
    
    async createPayment(dto: CreatePaymentRequest): Promise<Payment> {
        const payment = new Payment();
        payment.id = Model.generateUUID();
        payment.customer = dto.customer;
        payment.totalAmount = dto.totalAmount;
        payment.status = PaymentStatus.PENDING;
        payment.orderId = dto.orderId;
        payment.createdAt = new Date();
        return await this.paymentRepository.create(payment);
    }

    async updatePaymentStatus(dto: UpdatePaymentStatusRequest): Promise<Payment> {
        const payment = await this.findPaymentById(dto.id);
        payment.status = dto.status;
        await this.paymentRepository.update(payment);
        this.domainEventbus.publish(new PaymentStatusUpdatedEvent({
            orderId: payment.orderId,
            status: payment.status
        }))
        return payment;
    }

    @NotFoundExceptionIfUndefined("Payment not found")
    private findPaymentById(id: string): Promise<Payment> {
        return this.paymentRepository.findById(id);
    }

}