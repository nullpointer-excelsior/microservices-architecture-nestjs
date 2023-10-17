import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./song.entity";
import { User } from "./user.entity";


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

  @ManyToOne(() => User, user => user.playlists)
  user: User;

}
