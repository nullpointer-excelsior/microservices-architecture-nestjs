import { IntegrationEvent } from "../integration.event";

export interface Song {
    id: string;
    title: string;
}

export interface Artist {
    id: string;
    name: string;
}

export interface Album {
    id: string;
    title: string;
}

export interface Favorites {
    songs: Song[];
    artists: Artist[];
    albums: Album[];
}

export interface FavoritesUpdatedPayload {
    userId: string;
    favorites: Favorites;
}

export class UserFavoritesUpdatedEvent extends IntegrationEvent<FavoritesUpdatedPayload> {
    constructor(payload: FavoritesUpdatedPayload) {
        super('music-discovery-ms', 'com.clonespotify.discovery.user-music-catalog.integration.favorites-updated', payload);
    }
}