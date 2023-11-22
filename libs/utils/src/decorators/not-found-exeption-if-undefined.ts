import { NotFoundException } from "@nestjs/common";

export function NotFoundExceptionIfUndefined(customMessage?: string) {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (!result) {
        throw new NotFoundException(customMessage || 'Recurso no encontrado');
      }
      return result;
    };
    return descriptor;
  };
}
