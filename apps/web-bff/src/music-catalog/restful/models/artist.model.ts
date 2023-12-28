
class Song {
    id: string;
    title: string;
    video: string;
    plays: number;
    storage: string;
    duration: number;
}

class Album {
    id: string;
    title: string;
    photo: string;
    year: number;
    songs: Song[];
}

export class Artist{
    id: string;
    name: string;
    photo: string;
    biography: string;
    albums: Album[];
}