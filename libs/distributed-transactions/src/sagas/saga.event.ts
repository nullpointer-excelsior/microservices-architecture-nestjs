import { IsDate, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';

type Props<T> = {
    transactionId: string;
    pattern: string;
    payload: T;
}

export abstract class SagaEvent<T> {

    @IsUUID()
    @IsNotEmpty()
    public readonly transactionId: string;

    @IsDate()
    @IsNotEmpty()
    public readonly timestamp: Date;

    @ValidateNested()
    public readonly payload: T;

    @IsString()
    @IsNotEmpty()
    public readonly pattern: string;

    constructor({ transactionId, pattern, payload }: Props<T>) {
        this.transactionId = transactionId;
        this.timestamp = new Date();
        this.pattern = pattern;
        this.payload = payload;
    }

}