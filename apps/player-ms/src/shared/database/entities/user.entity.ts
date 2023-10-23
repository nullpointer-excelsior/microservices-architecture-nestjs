import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./playlist.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  premium: boolean;

  @OneToMany(() => Playlist, playlist => playlist.user)
  playlists: Playlist[];

}
