import { Body, Controller, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreatePurchaseRequest } from "../../../application/dto/create-purchase.dto";
import { OrderCreatedResponse } from "../../../application/dto/order-created.dto";
import { PurchaseApplication } from "../../../application/purchase.application";

@Controller('purchases')
@ApiTags('Purchases')
export class PurchaseController {
 
    constructor(private readonly application: PurchaseApplication) {}
    
    @Post()
    @ApiOperation({ description: 'Create a new purchase' })
    @ApiCreatedResponse({ description: 'The purchase has been created successfully', type: OrderCreatedResponse })
    createPurchaseProccess(@Body() request: CreatePurchaseRequest) {
        return this.application.startPurchaseProccess(request)
    }
}