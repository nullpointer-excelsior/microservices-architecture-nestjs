import { IsNotEmpty } from "class-validator";
import { Model } from "../../../shared/seedwork/model";


export class Album extends Model {

    @IsNotEmpty()
    title: string;

}
