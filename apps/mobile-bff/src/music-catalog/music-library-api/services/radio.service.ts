import { Injectable } from "@nestjs/common";
import { PlayerCLient } from "../../shared/client/player.client";
import { Span } from "nestjs-otel";

@Injectable()
export class RadioService {

    constructor(private client: PlayerCLient) { }

    @Span("RadioService/findAll")
    findAll() {
        return this.client.get('radios')
    }

    @Span("RadioService/findById")
    findById(id: string){
        return this.client.get(`radios/${id}`)
    }

}