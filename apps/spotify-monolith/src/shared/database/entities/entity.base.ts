import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export abstract class EntityBase {

  @PrimaryGeneratedColumn("uuid")
  id: string;

}
