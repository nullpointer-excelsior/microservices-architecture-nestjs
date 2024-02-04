import { IsNotEmpty } from "class-validator";
import { Model } from "@lib/utils/seedwork";

export class Song extends Model {

    @IsNotEmpty()
    title: string;

}