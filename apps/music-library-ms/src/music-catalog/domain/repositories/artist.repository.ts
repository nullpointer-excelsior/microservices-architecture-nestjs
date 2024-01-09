import { Artist } from "../models/artist.model";

export abstract class ArtistRepository {
    abstract findAll(): Promise<Artist[]>;
    abstract findById(id: string): Promise<Artist>;
}