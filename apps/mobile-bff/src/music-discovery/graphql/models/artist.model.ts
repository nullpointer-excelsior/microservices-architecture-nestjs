import { Field, ObjectType } from '@nestjs/graphql';
import { Album } from './album.model';

@ObjectType()
export class Artist {

    @Field({ nullable: true })
    id: string;

    @Field()
    name: string;
    
    @Field({ nullable: true })
    photo?: string;

    @Field({ nullable: true })
    biography?: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Field(type =>[Album], { nullable: 'itemsAndList' })
    albums?: Album[]
  
}