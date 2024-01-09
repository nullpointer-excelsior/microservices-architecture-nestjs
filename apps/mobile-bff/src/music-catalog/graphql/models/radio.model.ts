import { Field, ObjectType } from '@nestjs/graphql';
import { Song } from "./song.model";

@ObjectType()
export class Radio {

    @Field({ nullable: true })
    id?: string;
    
    @Field()
    name: string;
    
    @Field(type => [Song], { nullable: 'itemsAndList' })
    songs?: Song[]
    
}