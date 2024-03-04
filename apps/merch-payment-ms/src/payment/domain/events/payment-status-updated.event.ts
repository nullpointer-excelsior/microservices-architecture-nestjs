import { DomainEvent } from "@lib/utils/seedwork";
import { PaymentStatus } from "../model/payment-status.enum";

interface Payload {
    orderId: string;
    status: PaymentStatus;
}

export class PaymentStatusUpdatedEvent extends DomainEvent<Payload> {

    public static readonly NAME = 'com.spotifyclone.user.payments.domain.payment-status-updated'
    
    constructor(payload: Payload) {
        super(PaymentStatusUpdatedEvent.NAME, payload);
    }
}