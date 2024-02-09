import { NotFoundException } from "@nestjs/common";
import { tap } from "rxjs";

export function NotFoundExceptionIfUndefinedPipe(customMessage?: string) {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      return originalMethod.apply(this, args).pipe(
        tap((data) => {
          if (!data) {
            throw new NotFoundException(customMessage || 'Recurso no encontrado');
          }
        })
      );
    };
    return descriptor;
  };
}
