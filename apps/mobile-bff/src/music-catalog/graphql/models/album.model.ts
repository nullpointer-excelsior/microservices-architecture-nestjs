import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Song } from './song.model';

@ObjectType()
export class Album {

    @Field({ nullable: true })
    id: string;

    @Field()
    title: string;

    @Field({ nullable: true })
    photo?: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Field(type => Int, { nullable: true })
    year?: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Field(type => [Song], { nullable: 'itemsAndList' })
    songs?: Song[]

}