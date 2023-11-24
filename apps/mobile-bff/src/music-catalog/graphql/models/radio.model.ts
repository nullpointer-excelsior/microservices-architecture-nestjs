import { Song } from "./song.model";
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Radio {

    @Field({ nullable: true })
    id?: string;
    
    @Field()
    name: string;
    
    @Field(type => [Song], { nullable: 'itemsAndList' })
    songs?: Song[]
    
}