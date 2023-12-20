import { SongAPI } from '@lib/music-library-api';
import { Inject, Injectable } from "@nestjs/common";
import { lastValueFrom, map, switchMap } from "rxjs";
import { StorageCLient } from '../../s3/client/storage.client';
import { S3ObjectResponseDTO } from "../model/s3object-response.dto";

@Injectable()
export class PlayerService {

    constructor(
        private readonly songAPI: SongAPI,
        private readonly storageClient: StorageCLient,
        @Inject('MUSIC_CATALOG_BUCKET') private readonly bucket: string
    ) {}

    getSongObject(id: string): Promise<S3ObjectResponseDTO> {
        const s3object$ = this.songAPI.findById(id).pipe(
            map(song => song.storage),
            switchMap(storageId => this.storageClient.getObject(this.bucket, storageId)),
            map(s3object => ({ Body: s3object.Body, ContentType: s3object.ContentType, ContentLength: s3object.ContentLength }))
        )
        return lastValueFrom(s3object$)
    }
}