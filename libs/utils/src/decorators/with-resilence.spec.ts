import { of, throwError } from "rxjs";
import { TimeoutError, resilence } from "./with-resilence";

describe('resilence', () => {
    const source$ = of('data');

    it('should return the source$ value if no errors occur', () => {
        const options = {
            timeout: 5000,
            retry: {
                count: 3,
                delay: 1000
            },
            fallback: 'fallback'
        };

        const result$ = resilence(source$)(options);

        result$.subscribe((value) => {
            expect(value).toBe('data');
        });
    });

    it('should throw TimeoutError if the source$ takes longer than the specified timeout', () => {
        const options = {
            timeout: 1000,
            retry: {
                count: 3,
                delay: 1000
            },
            fallback: 'fallback'
        };

        const result$ = resilence(source$)(options);

        result$.subscribe({
            error: (error) => {
                expect(error).toBeInstanceOf(TimeoutError);
            }
        });
    });

    it('should retry the source$ the specified number of times if an error occurs', () => {
        const options = {
            timeout: 5000,
            retry: {
                count: 3,
                delay: 1000
            },
            fallback: 'fallback'
        };

        const error = new Error('Some error');
        const source$ = throwError(() => error);

        const result$ = resilence(source$)(options);

        result$.subscribe({
            error: (err) => {
                expect(err).toBe(error);
            }
        });
    });

    it('should return the fallback value if an error occurs and fallback is provided', () => {
        const options = {
            timeout: 5000,
            retry: {
                count: 3,
                delay: 1000
            },
            fallback: 'fallback'
        };

        const error = new Error('Some error');
        const source$ = throwError(() => error);

        const result$ = resilence(source$)(options);

        result$.subscribe((value) => {
            expect(value).toBe('fallback');
        });
    });
});