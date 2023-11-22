import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Song {
  @Prop()
  title: string;
}

@Schema()
export class SongDocument extends Document {
  
  @Prop()
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

export const SongSchema = SchemaFactory.createForClass(SongDocument);
