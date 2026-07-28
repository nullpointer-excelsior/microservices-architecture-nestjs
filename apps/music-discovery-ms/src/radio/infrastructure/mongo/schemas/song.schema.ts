import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Song {

  @Prop({ type: String })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  artist: string;

  @Prop()
  album: string;

  @Prop()
  genre: string;

}

export type SongDocument = Song & Document;
export const SongSchema = SchemaFactory.createForClass(Song);
SongSchema.virtual('id').get(function (this: any) {
  return this._id;
});
SongSchema.set('toJSON', { virtuals: true });
SongSchema.set('toObject', { virtuals: true });
