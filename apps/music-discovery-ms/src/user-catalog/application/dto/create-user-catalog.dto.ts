import { PickType } from "@nestjs/swagger";
import { UserCatalog } from "../../domain/model/user-catalog.model";

export class CreateUserCatalogDto extends PickType(UserCatalog, ['username', 'userId'] as const) {
    
}