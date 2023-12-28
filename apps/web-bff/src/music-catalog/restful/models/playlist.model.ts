import { COLORS } from "../constants/colors";

export class Playlist {
    id: string;
    albumId: string;
    title: string;
    color: (typeof COLORS)[keyof typeof COLORS];
    cover: string;
    artists: string[];
  }