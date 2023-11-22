import { Injectable } from "@nestjs/common";
import { RadioRepository } from "../../../domain/repositories/radio.repository";
import { Radio } from "../../../domain/model/radio.model";
import { InjectModel } from "@nestjs/mongoose";
import { RadioDocument } from "../schemas/radio.schema";
import { Model } from "mongoose";
import { Song } from "../../../domain/model/song.model";

@Injectable()
export class MongoRadioRepository extends RadioRepository {
    
    constructor(@InjectModel(RadioDocument.name) private model: Model<RadioDocument>) {
        super()
    }

    async save(radio: Radio): Promise<Radio> {
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

    async findById(id: string): Promise<Radio> {
        const radioFound = await this.model.findById(id)
        return Radio.create({ 
            id: radioFound.id,
            name: radioFound.name,
            songs: radioFound.songs.map(s => Song.create({ 
                id: s.id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        })
    }

    async findAll(): Promise<Radio[]> {
        return (await this.model.find()).map(doc => Radio.create({
            id: doc.id,
            name: doc.name,
            songs: doc.songs.map(s => Song.create({ 
                id: s._id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        }))
    }

    async update(radio: Radio): Promise<Radio> {
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
        
        return Radio.create({ 
            id: radioUpdated.id,
            name: radioUpdated.name,
            songs: radioUpdated.songs.map(s => Song.create({ 
                id: s.id,
                title: s.title,
                artist: s.artist,
                album: s.album,
                genre: s.genre
            }))
        })
    }

}
