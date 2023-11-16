import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./album.entity";
import { Artist } from "./artist.entity";
import { Genre } from "./genre.entity";
import { Radio } from "./radio.entity";


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

  @ManyToOne(() => Album, album => album.songs, { nullable: false })
  album: Album;

  @ManyToOne(() => Artist, artist => artist.songs, { nullable: false })
  artist: Artist;

  @ManyToOne(() => Genre, genre => genre.songs, { nullable: false })
  genre: Genre

  @ManyToMany(() => Radio, (radio) => radio.songs)
  @JoinTable()
  radios: Radio[]

}
