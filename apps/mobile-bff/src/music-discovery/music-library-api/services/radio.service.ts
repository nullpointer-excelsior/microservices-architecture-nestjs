import { Injectable } from "@nestjs/common";
import { PlayerCLient } from "../../shared/client/player.client";

@Injectable()
export class RadioService {

    constructor(private client: PlayerCLient) { }

    findAll() {
        return this.client.get('radios')
    }

    findById(id: string){
        return this.client.get(`radios/${id}`)
    }

}