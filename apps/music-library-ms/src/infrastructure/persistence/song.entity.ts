import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('songs')
export class SongEntity {
    @PrimaryColumn("uuid")
    id: string;
    @Column()
    name: string;
    @Column()
    genre: string;
    @Column()
    album: string;
    @Column()
    artist: string;
    @Column({ unique: false })
    trackUrl: string;
}