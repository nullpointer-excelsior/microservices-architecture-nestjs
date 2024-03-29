import { Logger, NotFoundException } from "@nestjs/common";

export function NotFoundExceptionIfUndefined(customMessage?: string) {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (!result) {
        const message = customMessage || 'Recurso no encontrado';
        const className = target.constructor.name;
        Logger.error(`${message}. args: ${args.join(',')}`, className);
        throw new NotFoundException(message);
      }
      return result;
    };
    return descriptor;
  };
}
