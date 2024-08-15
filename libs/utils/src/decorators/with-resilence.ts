import { Observable, catchError, iif, of, retry, tap, throwError, timeout } from "rxjs";


export class TimeoutError extends Error {
    constructor() {
        super('Resilence(error=timeout)');
    }
}

type ResilenceOptions<T> = {
    timeout: number,
    retry: {
        count: number,
        delay: number
    },
    fallback?: T
}

export function resilence<T = any>(source$: Observable<T>) {
    return function <T = any>(options: ResilenceOptions<T>) {
        const { timeout: timeoutMilliseconds, retry: retryOptions, fallback } = options;
        return source$.pipe(
            tap(() => console.log('resilenceOptions-tap')),
            timeout({
                each: timeoutMilliseconds,
                with: () => throwError(() => new TimeoutError())
            }),
            retry({
                count: retryOptions.count,
                delay: retryOptions.delay
            }),
            catchError(err => iif(() => fallback !== undefined, of(fallback), throwError(() => err)))
        )
    }
}

export function WithResilence<T>(resilenceOptions: ResilenceOptions<T>) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const source$ = originalMethod.apply(this, args)
            console.log('resilenceOptions-obs', resilenceOptions)
            return resilence(source$)(resilenceOptions)
        };
        return descriptor;
    };
}