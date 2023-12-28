import { AlbumAPI, ArtistAPI, SongAPI } from "@lib/music-library-api";
import { Inject, Injectable } from "@nestjs/common";
import * as crypto from 'crypto';
import { Observable, forkJoin, map, mergeMap, of, toArray } from "rxjs";
import { COLORS } from "../constants/colors";
import { Artist } from "../models/artist.model";
import { Playlist } from "../models/playlist.model";

function getRandomColor(): any {
    const colorKeys = Object.keys(COLORS)
    const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    return COLORS[randomKey];
}

function toMD5(input: string) {
    return crypto.createHash('md5').update(input).digest('hex');
}

@Injectable()
export class CatalogService {

    constructor(
        private readonly artistAPI: ArtistAPI,
        private readonly albumAPI: AlbumAPI,
        private readonly songAPI: SongAPI,
        @Inject('PLAYER_API') private readonly playerApiUrl: string
    ) { }

    getHomeLibrary() {
        const library$ = this.getArtists()
        return forkJoin([
            this.getPlaylists(library$),
            this.getSongs(library$),
        ]).pipe(
            map(([playlists, songs]) => ({ playlists, songs }))
        )
    }
    
    private getPlaylists(library$: Observable<Artist>): Observable<Playlist[]> {
        return library$.pipe(
            mergeMap(library => library.albums.map(album => ({ ...album, artist: library.name }))),
            map(album => ({
                albumId: album.id,
                title: album.title,
                color: getRandomColor(),
                cover: `${this.playerApiUrl}/cover/albums/${album.id}`,
                artists: [album.artist],
                id: toMD5(`${album.artist}-${album.title}`),
            })),
            toArray()
        )
    }

    private getSongs(library$: Observable<Artist>) {
        return library$.pipe(
            mergeMap(artist => of(artist.albums).pipe(
                mergeMap(albums => albums),
                mergeMap(album => of(album.songs).pipe(
                    mergeMap(songs => songs),
                    map(song => ({
                        id: song.id,
                        albumId: album.id,
                        album: album.title,
                        image: `${this.playerApiUrl}/cover/albums/${album.id}`,
                        artists: [artist.name],
                        title: song.title,
                        duration: song.duration,
                        url: `${this.playerApiUrl}/audio/songs/${song.id}`,
                    }))
                ))
            )
            ),
            toArray()
        )
    }

    private getArtists(): Observable<Artist> {
        return this.artistAPI.findAll().pipe(
            mergeMap(artists => artists),
            mergeMap(artist => {
                return this.albumAPI.findByArtistId(artist.id).pipe(
                    mergeMap(albums => albums),
                    mergeMap(album => {
                        return this.songAPI.findByAlbumId(album.id).pipe(
                            map(songs => ({ ...album, songs })),
                            toArray()
                        )
                    }),
                    map(albums => ({ ...artist, albums })),
                )
            }),
        )
    }


}