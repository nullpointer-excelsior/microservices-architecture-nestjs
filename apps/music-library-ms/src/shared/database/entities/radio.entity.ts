import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Genre } from "./genre.entity";
import { Song } from "./song.entity";

@Entity()
export class Radio {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Song, (song) => song.radios)
  songs: Song[];

  @ManyToOne(() => Genre, genre => genre.songs)
  genre: Genre

}
