import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./album.entity";
import { Artist } from "./artist.entity";
import { Genre } from "./genre.entity";


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

  @Column()
  duration: number;

  @ManyToOne(() => Album, album => album.songs)
  album: Album;

  @ManyToOne(() => Artist, artist => artist.songs)
  artist: Artist;

  @ManyToOne(() => Genre, genre => genre.songs)
  genre: Genre

}
