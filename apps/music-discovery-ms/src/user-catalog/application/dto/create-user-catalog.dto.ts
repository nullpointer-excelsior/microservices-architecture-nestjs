import { IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { User } from "../../domain/model/user.model";

export class CreateUserCatalogDto {
    
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @ValidateNested()
    user: User;

}