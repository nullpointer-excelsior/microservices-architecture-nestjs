import { CANCELLED } from "dns";

export enum OrderStatus {
    CREATED = 'created',
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}