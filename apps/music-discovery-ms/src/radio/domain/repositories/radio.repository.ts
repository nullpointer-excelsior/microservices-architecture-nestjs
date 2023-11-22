import { Radio } from "../model/radio.model";

export abstract class RadioRepository {
    abstract findById(id: string): Promise<Radio>
    abstract findAll(): Promise<Radio[]>
    abstract save(radio: Radio): Promise<Radio>
    abstract update(radio: Radio): Promise<Radio>
}