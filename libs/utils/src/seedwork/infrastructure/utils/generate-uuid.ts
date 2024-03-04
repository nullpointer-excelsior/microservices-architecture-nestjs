import * as crypto from 'crypto';

export function generateUUID() {
    return crypto.randomUUID();
}