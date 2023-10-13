import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { Genre } from "./Genre";


@Entity()
export class Song {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  video: string;

  @Column()
  plays: number;

  @ManyToOne(() => Album, album => album.songs)
  album: Album;

  @ManyToOne(() => Artist, artist => artist.songs)
  artist: Artist;

  @ManyToOne(() => Genre, genre => genre.songs)
  genre: Genre

}
