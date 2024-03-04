import { IsString, IsUUID } from "class-validator";

export class Customer {
    
    @IsUUID()
    id: string;

    @IsString()
    fullname: string;

    @IsString()
    email: string;

    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    country: string;

}