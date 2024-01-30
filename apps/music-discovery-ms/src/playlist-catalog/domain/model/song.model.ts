import { IsNotEmpty, IsString } from "class-validator";
import { Model } from "../../../shared/seedwork/model";

export class Song extends Model {
    @IsString()
    @IsNotEmpty()
    title: string;
}
