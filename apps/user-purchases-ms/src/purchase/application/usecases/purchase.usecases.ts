import { Injectable, Logger } from "@nestjs/common";
import { PurchaseApplication } from "../purchase.application";
import { CreatePurchaseRequest } from "../dto/create-purchase.dto";
import { OrderCreatedResponse } from "../dto/order-created.dto";
import { generateUUID } from "@lib/utils/seedwork";
import { Order } from "../../domain/model/order.model";
import { SagaCoordinatorApplication } from "../saga-coordinator.application";
import { CreateOrderTransactionEvent } from "@lib/distributed-transactions/user-purchases";
import { Purchase } from "../../domain/model/purchase.model";
import { PurchaseStatus } from "../../domain/model/purchase-status";
import { PurchaseRepository } from "../../domain/repositories/purchase.repository";

@Injectable()
export class PurchaseUseCases extends PurchaseApplication {
    
    private readonly logger = new Logger(PurchaseUseCases.name)

    constructor(
        private readonly sagaCoordinator: SagaCoordinatorApplication,
        private readonly purchaseRepository: PurchaseRepository
    ) {
        super();
    }

    async startPurchaseProccess(dto: CreatePurchaseRequest): Promise<OrderCreatedResponse> {
        
        const order = new Order()
        order.id = generateUUID()
        order.customer = dto.customer
        order.lines = dto.lines
        
        const purchase = new Purchase()
        purchase.id = generateUUID()
        purchase.customer = dto.customer
        purchase.products = dto.lines.map(l => ({ sku: l.sku, quantity: l.quantity, unitPrice: l.unitPrice }))
        purchase.status = PurchaseStatus.CREATED
        purchase.orderId = order.id
        
        this.logger.log(`Starting a new purchase with order-id: ${order.id}`)
        
        await this.purchaseRepository.save(purchase)

        this.sagaCoordinator.startOrderTransaction(new CreateOrderTransactionEvent(order))
        
        return Promise.resolve({ 
            orderId: order.id, 
            purchaseCreatedAt: new Date() 
        })

    }

}