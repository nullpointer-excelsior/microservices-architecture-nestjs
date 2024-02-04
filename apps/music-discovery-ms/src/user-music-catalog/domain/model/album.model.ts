import { IsNotEmpty } from "class-validator";
import { Model } from "@lib/utils/seedwork";


export class Album extends Model {

    @IsNotEmpty()
    title: string;

}
