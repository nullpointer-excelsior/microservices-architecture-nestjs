import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Song, SongSchema } from './song.schema';

@Schema({ collection: 'radios' })
export class Radio {

  @Prop({ type: String })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [SongSchema], default: [] })
  songs: Song[];

}

export type RadioDocument = Radio & Document;
export const RadioSchema = SchemaFactory.createForClass(Radio);
RadioSchema.virtual('id').get(function (this: any) {
  return this._id;
});
RadioSchema.set('toJSON', { virtuals: true });
RadioSchema.set('toObject', { virtuals: true });
