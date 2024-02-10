import { DomainEventBus } from "@lib/utils/seedwork";
import { Injectable } from "@nestjs/common";
import { FavoritesUpdatedEvent } from "../../shared/domain-events/user-music-catalog/favorites-updated.event";
import { PlaylistUpdatedEvent } from "../../shared/domain-events/user-music-catalog/playlist-updated.event";
import { UserCatalog } from "../domain/model/user-catalog.model";
import { UserCatalogService } from "../domain/services/user-catalog.service";
import { CreateUserCatalogDto } from "./dto/create-user-catalog.dto";
import { UpdateFavoritesDto } from "./dto/update-favorites.dto";
import { UpdatePlaylistsDto } from "./dto/update-playlists.dto";

@Injectable()
export class UserCatalogUseCases {

    constructor(
        private readonly catalog: UserCatalogService,
        private readonly domainEventbus: DomainEventBus
    ) { }

    findById(id: string) {
        return this.catalog.findById(id);
    }

    findMusicCatalogByUserId(id: string) {
        return this.catalog.findByUserId(id);
    }

    async createMusicCatalog(dto: CreateUserCatalogDto) {
        const catalog = new UserCatalog();
        catalog.id = dto.id;
        catalog.user = dto.user;
        catalog.playlists = [];
        catalog.favorites = {
            songs: [],
            artists: [],
            albums: []
        };
        await this.catalog.create(catalog);
        return catalog;
    }

    async updatePlaylists(dto: UpdatePlaylistsDto) {

        const playlistNotToUpdate = (playlists) => playlists.filter(p => p.id !== dto.playlist.id);

        return await this.catalog.findById(dto.userCatalogId)
            .then(catalog => {
                catalog.playlists = [
                    ...playlistNotToUpdate(catalog.playlists),
                    dto.playlist
                ]
                return catalog
            })
            .then(async catalog => {
                await this.catalog.save(catalog)
                return catalog
            })
            .then(catalog => {
                this.domainEventbus.publish(new PlaylistUpdatedEvent(dto.playlist));
                return catalog
            });

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
                this.domainEventbus.publish(new FavoritesUpdatedEvent(dto))
                return catalog
            });
    }

}