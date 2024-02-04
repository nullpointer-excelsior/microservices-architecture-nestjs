import { IsNotEmpty } from "class-validator";
import { Model } from "@lib/utils/seedwork";


export class Artist  extends Model {
    
    @IsNotEmpty()
    name: string;

}
