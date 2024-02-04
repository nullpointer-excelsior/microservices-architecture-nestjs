import { IsString, IsUUID, validateSync } from "class-validator";
import * as crypto from 'crypto';


/**
 * Represents a base model class that provides common functionality for models.
 */
export class Model {

    /**
     * The unique identifier of the model.
     */
    @IsUUID()
    @IsString()
    id: string;

    /**
     * Updates and validates a model instance.
     * 
     * @template T - The type of the model.
     * @param {T} model - The model instance to update and validate.
     * @param {(prev: T) => T} callback - The callback function that performs the update on the model.
     * @returns {T} - The updated and validated model instance.
     * @throws {ValidationModelExeption} - If the updated model fails validation.
     */
    static updateAndValidate<T extends Model>(model: T, callback: (prev: T) => T): T {
        const updated = callback(model)
        const errors = validateSync(updated);
        if (errors.length === 0) {
            return updated;
        }
        throw new ValidationModelExeption(errors.toString())
    }

    /**
     * Generates a UUID using the crypto module function.
     * 
     * @returns {string} The generated UUID.
     */
    static generateUUID(): string {
        return crypto.randomUUID();
    }

}

/**
 * Represents an exception that occurs during model validation.
 */
export class ValidationModelExeption extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationModelExeption';
        Object.setPrototypeOf(this, ValidationModelExeption.prototype);
    }
}

