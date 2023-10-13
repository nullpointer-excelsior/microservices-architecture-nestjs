import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class Playlist {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  duration: number;

  // @OneToMany(() => Song, song => song.playlists)
  // songs: Song[];

  @ManyToOne(() => Playlist, playlist => playlist.user)
  user: User;

}
