import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyMonolithService {
  getHello(): string {
    return 'Hello World!';
  }
}
