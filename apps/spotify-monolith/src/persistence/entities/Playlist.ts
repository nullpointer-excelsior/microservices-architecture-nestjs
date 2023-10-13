import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./Song";
import { User } from "./User";


@Entity()
export class Playlist {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @ManyToMany(() => Song)
  @JoinTable()
  songs: Song[];

  @ManyToOne(() => Playlist, playlist => playlist.user)
  user: User;

}
