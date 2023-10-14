import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./song.entity";
import { Genre } from "./genre.entity";

@Entity()
export class Radio {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Song, song => song.genre)
  songs: Song[];

  @OneToOne(() => Genre)
  @JoinColumn()
  genre: Genre

}
