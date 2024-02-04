import { Injectable } from "@nestjs/common";
import { FavoritesUpdatedEvent } from "../../shared/domain-events/user-music-catalog/favorites-updated.event";
import { UserCatalog } from "../domain/model/user-catalog.model";
import { UserCatalogService } from "../domain/services/user-catalog.service";
import { CreateUserCatalogDto } from "./dto/create-user-catalog.dto";
import { UpdateFavoritesDto } from "./dto/update-favorites.dto";
import { UpdatePlaylistsDto } from "./dto/update-playlists.dto";
import { Model, EventBus } from "@lib/utils/seedwork";
import { PlaylistUpdatedEvent } from "../../shared/domain-events/user-music-catalog/playlist-updated.event";

@Injectable()
export class UserCatalogUseCases {

    constructor(
        private readonly catalog: UserCatalogService,
        private readonly eventbus: EventBus
    ) { }

    async createMusicCatalog(dto: CreateUserCatalogDto) {
        const catalog = new UserCatalog();
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
            .then(async catalog => {
                await this.catalog.save(catalog)
                return catalog
            })
            .then(catalog => {
                this.eventbus.publish(new FavoritesUpdatedEvent(dto))
                return catalog
            });
    }

}