import { User } from "../../../shared/database/entities/user.entity";

export interface UserRepository {
 
    findById(id: string): Promise<User>;
    
}