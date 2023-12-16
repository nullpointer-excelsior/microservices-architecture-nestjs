import { Injectable } from "@nestjs/common";
import { Radio } from "../model/radio.model";
import { HttpClient } from "@lib/utils/http-client";
@Injectable()
export class RadioAPI {

    constructor(private client: HttpClient) { }

    findById(id: string) {
        return this.client.get<Radio>(`radios/${id}`)
    }

    findAll() {
        return this.client.get<Radio>('radios')
    }

}