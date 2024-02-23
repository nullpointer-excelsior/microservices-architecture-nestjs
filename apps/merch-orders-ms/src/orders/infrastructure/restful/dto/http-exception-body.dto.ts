import { ApiProperty } from '@nestjs/swagger';

export type HttpExceptionBodyMessage = string | string[];

export class HttpExceptionBody {

    @ApiProperty({ description: 'The error message', type: String })
    message: HttpExceptionBodyMessage;

    @ApiProperty({ description: 'The error details', required: false })
    error?: string;

    @ApiProperty({ description: 'The HTTP status code', example: 500, type: Number})
    statusCode: number;

    constructor(message: HttpExceptionBodyMessage, statusCode: number, error?: string) {
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
}