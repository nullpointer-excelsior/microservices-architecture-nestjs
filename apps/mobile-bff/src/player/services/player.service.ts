import { SongAPI } from '@lib/music-library-api';
import { Injectable } from "@nestjs/common";
import { lastValueFrom, map, switchMap } from "rxjs";
import { S3ObjectResponseDTO } from "../models/s3object-response.dto";
import { StorageService } from "./storage.service";

@Injectable()
export class PlayerService {

    constructor(
        private readonly songAPI: SongAPI,
        private readonly storageService: StorageService
    ) {}

    getSongObject(id: string): Promise<S3ObjectResponseDTO> {
        const s3object$ = this.songAPI.findById(id).pipe(
            map(song => song.storage),
            switchMap(storageId => this.storageService.getSongObject(storageId)),
            map(s3object => ({ Body: s3object.Body, ContentType: s3object.ContentType, ContentLength: s3object.ContentLength }))
        )
        return lastValueFrom(s3object$)
    }
}