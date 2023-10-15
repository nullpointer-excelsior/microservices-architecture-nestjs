import { UserModel } from "../../../accounts/model/user.model";
import { SongModel } from "../../../music-library/model/song.model";

export class PlaylistModel {

    id: string;
  
    name: string;
  
    duration: number;
    
    songs: SongModel[];
  
    user: UserModel;

  
  }