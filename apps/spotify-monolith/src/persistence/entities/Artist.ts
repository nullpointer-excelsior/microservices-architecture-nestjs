import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Genre } from "./Genre";
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

  // @ManyToMany(() => Genre, genre => genre.artists)
  // genres: Genre[];

  @OneToMany(() => Song, song => song.artist)
  songs: Song[]

  @OneToMany(() => Album, album => album.artist)
  albums: Album[]

}
