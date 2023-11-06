import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Song {

  @Field({ nullable: true })
  id: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  video: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => Int, { nullable: true })
  plays: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => Int, { nullable: true })
  duration: number;
  
}