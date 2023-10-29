import { Field, ObjectType } from "@nestjs/graphql";
import { Genre } from "./genre.model";
import { Song } from "./song.model";

@ObjectType()
export class Radio {

  @Field({ nullable: true })
  id?: string;

  @Field()
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => Genre, { nullable: true })
  genre?: Genre;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => [Song], { nullable: 'itemsAndList' })
  songs?: Song[]

}