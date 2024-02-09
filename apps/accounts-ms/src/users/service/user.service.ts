import { IntegrationEventBus, UserCreatedEvent } from "@lib/integration-events";
import { NotFoundExceptionIfUndefined } from "@lib/utils/decorators";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../shared/database/entities/user.entity";
import { UserModel } from "../model/user.model";

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private readonly integrationEventBus: IntegrationEventBus
  ) {}

  async findAll(): Promise<User[]> {
    return await this.repository.find()
  }

  @NotFoundExceptionIfUndefined("User not found")
  async findById(id: string): Promise<User> {
    return await this.repository.findOneBy({ id });
  }

  async create(user: UserModel): Promise<User> {
    const userCreated = await this.repository.save(user);
    this.integrationEventBus.publish(new UserCreatedEvent({
      id: userCreated.id,
      username: userCreated.username,
      email: userCreated.email
    }));
    return userCreated;
  }

  async update(user: UserModel): Promise<User> {
    return await this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

}