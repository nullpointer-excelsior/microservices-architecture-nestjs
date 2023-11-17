type Props = {
    message: string;
    status: number;
    response: string;
    url: string;
  }

export class HttpClientError extends Error {
    
    public readonly status: number;
    public readonly response: string;
    public readonly url: string;

    constructor({ message, status: statusResponse, response: textResponse, url }: Props) {
        super(message);
        this.name = this.constructor.name;
        this.status = statusResponse;
        this.response = textResponse;
        this.url = url;
        Object.setPrototypeOf(this, HttpClientError.prototype);
      }

}