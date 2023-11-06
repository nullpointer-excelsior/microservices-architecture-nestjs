import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Radio } from "../../shared/database/entities/radio.entity";
import { CreateRadioRequest } from "../dto/create-radio.request";
import { RadioModel } from "../model/radio.model";
import { Span } from "nestjs-otel";

@Injectable()
export class RadioService {

    constructor(@InjectRepository(Radio) private repository: Repository<Radio>) { }

    @Span("RadioService/save")
    save(radio: CreateRadioRequest) {
        return this.repository.save(radio)
    }

    @Span("RadioService/update")
    update(genre: RadioModel) {
        return this.repository.save(genre)
    }

    @Span("RadioService/findByGenreId")
    findByGenreId(id: string) {
        return this.repository.find({
            where: {
                genre: {
                    id
                }
            }
        })
    }

    @Span("RadioService/findAll")
    findAll() {
        return this.repository.find()
    }

}