import { NotFoundException } from "@nestjs/common";

export function NotFoundExceptionIfUndefined(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
  
    descriptor.value = async function(...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (result === undefined) {
        throw new NotFoundException();
      }
      return result;
    };
  
    return descriptor;
  }
  