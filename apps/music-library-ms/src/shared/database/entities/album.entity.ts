import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./song.entity";
import { Artist } from "./artist.entity";

@Entity()
export class Album {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  photo: string;

  @Column()
  year: number;

  @OneToMany(() => Song, song => song.album)
  songs: Song[];

  @ManyToOne(() => Artist, artist => artist.albums)
  artist: Artist

}
