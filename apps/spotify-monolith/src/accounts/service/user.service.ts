import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../shared/database/entities/user.entity";
import { UserModel } from "../model/user.model";

@Injectable()
export class UserService {
  
  constructor(@InjectRepository(User)private userRepository: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(user: UserModel): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(user: UserModel): Promise<User> {
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}