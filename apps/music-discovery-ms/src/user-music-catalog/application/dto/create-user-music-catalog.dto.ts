import { PickType } from "@nestjs/swagger";
import { UserMusicCatalog } from "../../domain/model/user-music-catalog.model";

export class CreateUserMusicCatalogDto extends PickType(UserMusicCatalog, ['username', 'userId'] as const) {
    
}