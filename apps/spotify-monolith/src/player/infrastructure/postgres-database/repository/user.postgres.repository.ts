import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../../../shared/database/entities/user.entity";
import { UserRepository } from "../../../domain/repository/UserRepository";

@Injectable()
export class UserPostgresRepository implements UserRepository {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id })
  }

}