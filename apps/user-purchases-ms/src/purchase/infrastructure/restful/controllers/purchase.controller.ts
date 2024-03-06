import { Body, Controller, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreatePurchaseRequest } from "../../../application/dto/create-purchase.dto";
import { PurchaseTransactionCreatedResponse } from "../../../application/dto/purchase-transaction-created.dto";
import { PurchaseApplication } from "../../../application/purchase.application";

@Controller('purchases')
@ApiTags('Purchases')
export class PurchaseController {
 
    constructor(private readonly application: PurchaseApplication) {}
    
    @Post()
    @ApiOperation({ description: 'Create a new purchase' })
    @ApiCreatedResponse({ description: 'The purchase process has been created successfully', type: PurchaseTransactionCreatedResponse })
    createPurchaseProccess(@Body() request: CreatePurchaseRequest) {
        return this.application.startPurchaseProccess(request)
    }
}