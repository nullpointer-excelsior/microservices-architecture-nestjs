import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../shared/database/entities/user.entity";
import { UserModel } from "../model/user.model";
import { NotFoundExceptionIfUndefined } from "../../shared/decorator/not-found-exception-if-undefined";

@Injectable()
export class UserService {
  
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return await this.repository.find()
  }

  @NotFoundExceptionIfUndefined
  async findOne(id: string): Promise<User> {
    return await this.repository.findOneBy({ id });
  }

  async create(user: UserModel): Promise<User> {
    return await this.repository.save(user);
  }

  async update(user: UserModel): Promise<User> {
    return await this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

}