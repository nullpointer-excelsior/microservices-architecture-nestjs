import { RabbitmqMessage } from "../RabbitmqMessage";

export interface NewSongDataMessage {
    id: string;
    albumId: string;
    genreId: string;
    title: string;
    video: string;
    duration: number;
}

export type NewSongMessage = RabbitmqMessage<NewSongDataMessage>