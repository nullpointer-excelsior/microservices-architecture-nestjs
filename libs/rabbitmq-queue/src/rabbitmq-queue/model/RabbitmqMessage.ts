export interface RabbitmqMessage<T> {
    id: string;
    pattern: string;
    timestamp: Date;
    data: T;
}