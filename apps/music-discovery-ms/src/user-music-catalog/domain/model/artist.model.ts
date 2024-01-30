import { IsNotEmpty } from "class-validator";
import { Model } from "../../../shared/seedwork/model";


export class Artist  extends Model {
    
    @IsNotEmpty()
    name: string;

}
