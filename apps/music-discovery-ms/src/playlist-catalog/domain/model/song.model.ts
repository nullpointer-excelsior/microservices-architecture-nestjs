import { IsNotEmpty, IsString } from "class-validator";
import { Model } from "../../../../../../libs/utils/src/seedwork/domain/model/model";

export class Song extends Model {
    @IsString()
    @IsNotEmpty()
    title: string;
}
