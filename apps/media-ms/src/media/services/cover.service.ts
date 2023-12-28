import { AlbumAPI, ArtistAPI } from '@lib/music-library-api';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom, map, switchMap, tap } from 'rxjs';
import { StorageCLient } from '../../s3/client/storage.client';

@Injectable()
export class CoverService {

    constructor(
        private readonly albumAPI: AlbumAPI,
        private readonly artistAPI: ArtistAPI,
        private readonly storageClient: StorageCLient,
        @Inject('MUSIC_CATALOG_BUCKET') private readonly bucket: string
    ) { }

    getArtistCoverObject(id: string) {
        const s3object$ = this.artistAPI.findById(id).pipe(
            map(artist => artist.photo),
            switchMap(storageId => this.storageClient.getObject(this.bucket, storageId)),
            map(s3object => ({ Body: s3object.Body, ContentType: s3object.ContentType, ContentLength: s3object.ContentLength }))
        )
        return lastValueFrom(s3object$)
    }

    getAlbumCoverObject(id: string) {
        const s3object$ = this.albumAPI.findById(id).pipe(
            map(album => album.photo),
            tap(console.log),
            switchMap(storageId => this.storageClient.getObject(this.bucket, storageId)),
            map(s3object => ({ Body: s3object.Body, ContentType: s3object.ContentType, ContentLength: s3object.ContentLength }))
        )
        return lastValueFrom(s3object$)
    }
}
