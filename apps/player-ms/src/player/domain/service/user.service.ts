import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../../shared/database/entities/user.entity";
import { NotFoundExceptionIfUndefined } from "../../../shared/decorator/not-found-exception-if-undefined";

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private repository: Repository<User>) { }

  @NotFoundExceptionIfUndefined
  findById(id: string): Promise<User> {
    return this.repository.findOneBy({ id })
  }

}