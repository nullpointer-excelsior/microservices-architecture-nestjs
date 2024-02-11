import { Observable, from, mergeMap } from "rxjs";

export function promiseListToObservable<T>(promise: Promise<T[]>): Observable<T> {
    return from(promise).pipe(
        mergeMap(identity => identity)
    );
}