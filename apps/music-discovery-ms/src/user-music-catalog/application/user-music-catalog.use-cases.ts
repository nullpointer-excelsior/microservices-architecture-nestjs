import { Injectable } from "@nestjs/common";
import { FavoritesUpdatedEvent } from "../../shared/domain-events/user-music-catalog/favorites-updated.event";
import { UserMusicCatalog } from "../domain/model/user-music-catalog.model";
import { UserMusicCatalogService } from "../domain/services/user-music-catalog.service";
import { CreateUserMusicCatalogDto } from "./dto/create-user-music-catalog.dto";
import { UpdateFavoritesDto } from "./dto/update-favorites.dto";
import { UpdatePlaylistsDto } from "./dto/update-playlists.dto";
import { Model, EventBus } from "@lib/utils/seedwork";
import { PlaylistUpdatedEvent } from "../../shared/domain-events/user-music-catalog/playlist-updated.event";

@Injectable()
export class UserMusicCatalogUseCases {

    constructor(
        private readonly catalog: UserMusicCatalogService,
        private readonly eventbus: EventBus
    ) { }

    async createMusicCatalog(dto: CreateUserMusicCatalogDto) {
        const catalog = new UserMusicCatalog();
        catalog.id = Model.generateUUID();
        catalog.userId = dto.userId;
        catalog.username = dto.username;
        catalog.playlists = [];
        catalog.favorites = {
            songs: [],
            artists: [],
            albums: []
        };
        await this.catalog.create(catalog);
        return catalog;
    }

    findMusicCatalogByUserId(id: string) {
        return this.catalog.findByUserId(id);
    }

    async updatePlaylists(dto: UpdatePlaylistsDto) {
        const catalog = await this.catalog.findByUserId(dto.userCatalogId);
        catalog.playlists = [
            ...catalog.playlists.filter(p => p.id !== dto.playlist.id),
            dto.playlist
        ]
        await this.catalog.save(catalog)
        this.eventbus.publish(new PlaylistUpdatedEvent(dto.playlist));
        return catalog;
    }

    async updateFavorites(dto: UpdateFavoritesDto) {
        return this.catalog.findByUserId(dto.userId)
            .then(catalog => {
                catalog.favorites = dto.favorites;
                return catalog
            })
            .then(catalog => this.catalog.save(catalog))
            .then(() => this.eventbus.publish(new FavoritesUpdatedEvent(dto)));
    }

}