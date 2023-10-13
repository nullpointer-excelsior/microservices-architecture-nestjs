import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./Playlist";

@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  premium: boolean;

  @OneToMany(() => Playlist, playlist => playlist.user)
  playlists: Playlist[];

}
