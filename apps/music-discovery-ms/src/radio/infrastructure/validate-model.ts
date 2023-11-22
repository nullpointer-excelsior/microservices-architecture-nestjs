import { validateOrReject } from "class-validator";

export class ValidationModelError extends Error {

    constructor(errors: any) {
        super(`Validation Failed \n${errors}\n`);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, ValidationModelError.prototype);
    }

}

export async function validateModel<T extends object>(model: T) {
    try {
        await validateOrReject(model);
    } catch (errors) {
        console.error(errors)
        throw new ValidationModelError(errors)
    }
    return model
}

export function ValidateArgumentModel(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const model = args[0];
        await validateModel(model);
        return await originalMethod.apply(this, args);
    };
}

export function ValidateReturnModel(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const returnValue = await originalMethod.apply(this, args);
        await validateModel(returnValue);
        return returnValue
    };
}