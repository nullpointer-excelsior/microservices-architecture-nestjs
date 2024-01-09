import { Genre } from "../models/genre.model";

export abstract class GenreRepository {
    abstract findAll(): Promise<Genre[]>;
    abstract findById(id: string): Promise<Genre>;
}