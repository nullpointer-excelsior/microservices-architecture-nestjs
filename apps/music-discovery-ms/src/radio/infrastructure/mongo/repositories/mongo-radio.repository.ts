import { Injectable } from "@nestjs/common";
import { RadioRepository } from "../../../domain/repositories/radio.repository";
import { Radio as RadioDomain } from "../../../domain/model/radio.model";
import { InjectModel } from "@nestjs/mongoose";
import { Radio, RadioDocument } from "../schemas/radio.schema";
import { SongDocument } from "../schemas/song.schema";
import { Model } from "mongoose";
import { Song } from "../../../domain/model/song.model";

@Injectable()
export class MongoRadioRepository extends RadioRepository {

    constructor(@InjectModel(Radio.name) private model: Model<RadioDocument>) {
        super()
    }

    async save(radio: RadioDomain): Promise<RadioDomain> {
        const songs = radio.songs.map(s => ({
            _id: s.id,
            title: s.title,
            album: s.album,
            artist: s.artist,
            genre: s.genre
        }))
        const radioCreated = new this.model({
            ...radio,
            _id: radio.id,
            songs: songs
        })
        await radioCreated.save()
        return radio
    }

    async findById(id: string): Promise<RadioDomain> {
        const radioFound = await this.model.findById(id)
        return RadioDomain.create({
            id: radioFound.id,
            name: radioFound.name,
            songs: radioFound.songs.map((s: SongDocument) => Song.create({
                id: s.id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        })
    }

    async findAll(): Promise<RadioDomain[]> {
        return (await this.model.find()).map(doc => RadioDomain.create({
            id: doc.id,
            name: doc.name,
            songs: doc.songs.map((s: SongDocument) => Song.create({
                id: s._id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        }))
    }

    async update(radio: RadioDomain): Promise<RadioDomain> {
        const songs = radio.songs.map(s => ({
            _id: s.id,
            title: s.title,
            album: s.album,
            artist: s.artist,
            genre: s.genre
        }))
        const radioUpdated = await this.model.findByIdAndUpdate(radio.id, {
            ...radio,
            songs
        }, { new: true })

        return RadioDomain.create({
            id: radioUpdated.id,
            name: radioUpdated.name,
            songs: radioUpdated.songs.map((s: SongDocument) => Song.create({
                id: s.id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        })
    }

}
