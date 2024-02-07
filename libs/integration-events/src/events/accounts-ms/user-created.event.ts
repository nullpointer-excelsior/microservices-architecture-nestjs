import { IntegrationEvent } from "../integration.event";

export interface Payload {
    id: string;
    username: string;
    email: string;
}

export class UserCreatedEvent extends IntegrationEvent<Payload> {
    constructor(payload: Payload) {
        super('accounts-ms', 'com.clonespotify.accounts.users.integration.user-updated', payload);
    }
}