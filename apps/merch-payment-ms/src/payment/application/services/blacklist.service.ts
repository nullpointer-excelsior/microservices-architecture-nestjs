import { Injectable } from "@nestjs/common";

@Injectable()
export class BlacklistService {

    private blacklist: string[] = [
        'compadre-moncho@email.com',
        'don-ramon@vecindad.mx'
    ]

    isBlacklisted(email: string): boolean {
        return this.blacklist.includes(email);
    }
}