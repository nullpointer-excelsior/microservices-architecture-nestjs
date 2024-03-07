import { Injectable } from "@nestjs/common";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { Delivery } from "../domain/model/delivery.model";
import { generateUUID } from "@lib/utils/seedwork";
import { DeliveryStatus } from "../domain/model/delivery.status";

@Injectable()
export class DeliveryService {

    private fakeDeliveryDays = 7;

    async create(dto: CreateDeliveryDto): Promise<Delivery> {
        if (dto.order.customer.city === 'Talca') {
            throw new Error('Delivery not available for Talca');
        }
        const delivery = new Delivery();
        delivery.id = generateUUID();
        delivery.estimatedDate = new Date();
        delivery.status = DeliveryStatus.PENDING;
        delivery.estimatedDate.setDate(delivery.estimatedDate.getDate() + this.fakeDeliveryDays);
        return delivery;
    }

}