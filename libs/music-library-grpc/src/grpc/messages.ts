
export interface ID {
    id: string;
}

export interface Album {
    id: string;
    title: string;
    photo: string;
    year: number;
}

export interface Artist {
    id: string;
    name: string;
    photo: string;
    biography: string;
}

export interface Genre {
    id: string;
    name: string;
}

export interface Song {
    id: string;
    title: string;
    video: string;
    plays: number;
    duration: number;
    artist_id: string;
    album_id: string;
    genre_id: string;
}

