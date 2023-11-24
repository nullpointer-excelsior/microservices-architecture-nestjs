import { Injectable } from "@nestjs/common";
import { MusicDiscoveryCLient } from "./client/music-discovery.client";
import { Radio } from "../model/radio.model";

@Injectable()
export class RadioAPI {

    constructor(private client: MusicDiscoveryCLient) { }

    findById(id: string) {
        return this.client.get<Radio>(`radios/${id}`)
    }

    findAll() {
        return this.client.get<Radio>('radios')
    }

}