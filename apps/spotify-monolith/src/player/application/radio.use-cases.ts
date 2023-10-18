import { Injectable } from "@nestjs/common";
import { CreateRadioRequest } from "../infrastructure/restful-api/dto/create-radio.request";
import { RadioService } from "../domain/service/radio.service";
import { Radio } from "../../shared/database/entities/radio.entity";
import { EntityCreatedResponse } from "../infrastructure/restful-api/dto/entity-created.response";

@Injectable()
export class RadioUseCases {

    constructor(private radio: RadioService) {}

    async create(request: CreateRadioRequest) {
        return this.radio
            .save(request as Radio)
            .then(entity => new EntityCreatedResponse(entity.id))
    }

    findByGenreId(id: string){
        return this.radio.findByGenreId(id)
    }

    findAll() {
        return this.radio.findAll()
    }
}