import { Body, Controller, Patch, Post } from "@nestjs/common";
import { PaymentApplication } from "../../application/payment.application";
import { CreatePaymentRequest } from "../../application/dto/create-payment-request.dto";
import { Payment } from "../../domain/model/payment.model";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdatePaymentStatusRequest } from "../../application/dto/update-payment-status-request.dto";

@ApiTags('payments')
@Controller('payments')
export class PaymentController {

    constructor(private readonly payment: PaymentApplication) {}

    @Post()
    @ApiOperation({ summary: 'Create a payment' })
    @ApiResponse({ status: 201, description: 'Payment created', type: Payment })
    async createPayment(@Body() request: CreatePaymentRequest): Promise<Payment> {
        return this.payment.createPayment(request);
    }

    @Patch('status')
    @ApiOperation({ summary: 'Update payment status' })
    @ApiResponse({ status: 200, description: 'Payment status updated', type: Payment })
    async updatePaymentStatus(@Body() request: UpdatePaymentStatusRequest): Promise<Payment> {
        return this.payment.updatePaymentStatus(request);
    }

}
