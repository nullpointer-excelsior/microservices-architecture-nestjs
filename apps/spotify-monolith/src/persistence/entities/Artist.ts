import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./Album";
import { Song } from "./Song";


@Entity()
export class Artist {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  photo: string;

  @Column()
  biography: string;

  @OneToMany(() => Song, song => song.artist)
  songs: Song[]

  @OneToMany(() => Album, album => album.artist)
  albums: Album[]

}
