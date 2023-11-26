import { RabbitmqMessage } from "../RabbitmqMessage";

export interface NewAlbumDataMessage {
    albumId: string;
    title: string;
}

export type NewAlbumMessage = RabbitmqMessage<NewAlbumDataMessage>