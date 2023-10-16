import { GenreEntity } from "./genre";
import { SongEntity } from "./song";

export class RadioEntity {

    id: string;
  
    name: string;
  
    songs: SongEntity[];
  
    genre: GenreEntity
  
  }