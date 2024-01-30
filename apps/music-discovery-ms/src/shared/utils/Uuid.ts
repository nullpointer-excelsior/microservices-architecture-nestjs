import * as short from 'short-uuid';

export class Uuid {
    
    static generateShort() {
        return short.generate();
    }

}