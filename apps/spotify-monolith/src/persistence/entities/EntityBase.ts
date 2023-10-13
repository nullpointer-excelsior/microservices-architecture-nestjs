import { PrimaryGeneratedColumn } from "typeorm";

export class EntityBase {

  @PrimaryGeneratedColumn("uuid")
  id: string;

}
