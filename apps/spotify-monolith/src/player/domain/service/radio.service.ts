import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Radio } from "../../../shared/database/entities/radio.entity";

@Injectable()
export class RadioService {

    constructor(@InjectRepository(Radio) private repository: Repository<Radio>) { }

    save(radio: Radio) {
        return this.repository.save(radio)
    }

    findByGenreId(id: string) {
        return this.repository.find({
            relations: {
                songs: true
            },
            where: {
                genre: {
                    id
                }
            }
        })
    }

    findAll() {
        return this.repository.find({ relations: { songs: true }})
    }
}