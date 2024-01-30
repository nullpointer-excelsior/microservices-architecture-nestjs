import { IsNotEmpty } from "class-validator";
import { Model } from "../../../shared/seedwork/model";

export class Song extends Model {

    @IsNotEmpty()
    title: string;

}