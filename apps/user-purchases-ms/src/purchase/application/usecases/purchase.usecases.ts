import { CreateOrderTransactionEvent, SagaExecutorService } from "@lib/distributed-transactions/user-purchases";
import { generateUUID } from "@lib/utils/seedwork";
import { Injectable, Logger } from "@nestjs/common";
import { Order } from "../../domain/model/order.model";
import { PurchaseStatus } from "../../domain/model/purchase-status";
import { SagaPurchase } from "../../domain/model/saga-purchase.model";
import { PurchaseRepository } from "../../domain/repositories/purchase.repository";
import { CreatePurchaseRequest } from "../dto/create-purchase.dto";
import { PurchaseTransactionCreatedResponse } from "../dto/purchase-transaction-created.dto";
import { PurchaseApplication } from "../purchase.application";

@Injectable()
export class PurchaseUseCases extends PurchaseApplication {
    
    private readonly logger = new Logger(PurchaseUseCases.name)

    constructor(
        private readonly sagaExecutor: SagaExecutorService,
        private readonly purchaseRepository: PurchaseRepository
    ) {
        super();
    }

    async startPurchaseProccess(dto: CreatePurchaseRequest): Promise<PurchaseTransactionCreatedResponse> {
        
        // const order = new Order()
        // order.customer = dto.customer
        // order.lines = dto.lines
        
        const sagaPurchase = new SagaPurchase()
        sagaPurchase.transactionId = generateUUID()
        sagaPurchase.status = PurchaseStatus.CREATED
        // sagaPurchase.order = order
        
        await this.purchaseRepository.save(sagaPurchase)

        this.sagaExecutor.execute(new CreateOrderTransactionEvent({
            transactionId: sagaPurchase.transactionId,
            payload: {
                customer: dto.customer,
                lines: dto.lines
            }
        }))
        
        return Promise.resolve({ 
            transactionId: sagaPurchase.transactionId 
        })

    }

}