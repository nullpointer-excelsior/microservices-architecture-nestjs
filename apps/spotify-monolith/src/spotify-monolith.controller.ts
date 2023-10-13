import { Controller, Get } from '@nestjs/common';
import { SpotifyMonolithService } from './spotify-monolith.service';

@Controller()
export class SpotifyMonolithController {
  constructor(private readonly spotifyMonolithService: SpotifyMonolithService) {}

  @Get()
  getHello(): string {
    return this.spotifyMonolithService.getHello();
  }
}
