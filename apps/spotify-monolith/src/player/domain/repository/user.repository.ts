import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../../shared/database/entities/user.entity";

@Injectable()
export class UserRepository {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  findById(id: string) {
    return this.userRepository.findOneBy({ id })
  }

}