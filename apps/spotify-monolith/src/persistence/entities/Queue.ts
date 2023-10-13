import { Column, Entity } from "typeorm";
import { Song } from "./Song";


@Entity()
export class Queue {

  @Column()
  songs: Song[];

}
