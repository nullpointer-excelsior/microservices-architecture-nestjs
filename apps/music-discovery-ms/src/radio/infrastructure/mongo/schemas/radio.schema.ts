import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SongDocument, SongSchema } from './song.schema';

@Schema({ collection: 'radios' })
export class RadioDocument extends Document {
  
  @Prop()
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [SongSchema], default: [] })
  songs: SongDocument[];

}

export const RadioSchema = SchemaFactory.createForClass(RadioDocument);
