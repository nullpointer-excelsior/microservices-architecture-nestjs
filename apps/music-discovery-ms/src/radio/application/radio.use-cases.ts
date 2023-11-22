import { Injectable } from "@nestjs/common";
import { NotFoundExceptionIfUndefined } from "@lib/utils/decorators/not-found-exeption-if-undefined";
import { Radio } from "../domain/model/radio.model";
import { RadioRepository } from "../domain/repositories/radio.repository";
import { CreateRadioDTO } from "./dto/create-radio.dto";
import { UpdateSongsDTO } from "./dto/update-songs.dto";
import { ValidateArgumentModel } from "../infrastructure/validate-model";

@Injectable()
export class RadioUseCases {

    constructor(private repository: RadioRepository) {}

    create(dto: CreateRadioDTO) {
        return this.repository.save(dto)
    }

    findById(id: string) {
        return this.repository.findById(id)
    }

    async updateSongs(dto: { radioId: string } & UpdateSongsDTO) {
        return this.findRadioById(dto.radioId)
            .then(radio => Radio.updateSongs(radio, dto.songs))
            .then(radio => this.updateRadio(radio))
    }

    async findAll() {
        return this.repository.findAll()
    }

    @NotFoundExceptionIfUndefined('Radio no encontrada')
    private findRadioById(id: string) {
        return this.repository.findById(id)
    }

    @ValidateArgumentModel
    private async updateRadio(radio: Radio) {
        return this.repository.update(radio)
    }

}