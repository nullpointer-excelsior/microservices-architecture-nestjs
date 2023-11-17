import { Field, ObjectType } from "@nestjs/graphql";
import { Song } from "./song.model";

@ObjectType()
export class Genre {
    
    @Field({ nullable: true })
    id: string;
    
    @Field()
    name: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Field(type => [Song], { nullable: 'itemsAndList' })
    songs?: Song[]

}