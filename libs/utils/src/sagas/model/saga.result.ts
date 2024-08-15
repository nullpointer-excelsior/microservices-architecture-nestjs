export interface OkResult<T = any> {
    queue: string;
    data: T
}

export interface ErrorResult<T = any> {
    queue: string;
    error: T
}

export class SagaResult {

    private constructor(public isSuccess: boolean, public ok: OkResult | undefined, public error: ErrorResult | undefined) { }

    static ok(ok: OkResult): SagaResult {
        return new SagaResult(true, ok, undefined);
    }

    static error(error: ErrorResult): SagaResult {
        return new SagaResult(false, undefined, error);
    }

}