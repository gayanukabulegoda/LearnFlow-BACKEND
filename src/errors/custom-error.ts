/**
 * CustomError class - to be used as a base class for all custom errors
 */
export class CustomError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}