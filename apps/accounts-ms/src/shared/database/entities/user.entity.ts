import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {

  @PrimaryColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

}
