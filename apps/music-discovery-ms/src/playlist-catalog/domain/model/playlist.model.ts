import { Song } from "./song.model";
import { Model } from '../../../shared/seedwork/model';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Playlist extends Model {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Song)
    songs: Song[]

    static create(props: { name: string, songs: Song[] }): Playlist {
        return Model.updateAndValidate(new Playlist(), prev => {
            prev.id = Model.generateUUID();
            prev.name = props.name;
            prev.songs = props.songs;
            return prev;
        })
    }

}