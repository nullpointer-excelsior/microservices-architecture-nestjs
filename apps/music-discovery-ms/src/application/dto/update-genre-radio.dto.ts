import { NewSongDataMessage } from "../../../../../libs/rabbitmq-queue/src/rabbitmq-queue/model/messages/new-song.message";

export type UpdateGenreRadioDto = Pick<NewSongDataMessage, 'id' | 'genreId'>