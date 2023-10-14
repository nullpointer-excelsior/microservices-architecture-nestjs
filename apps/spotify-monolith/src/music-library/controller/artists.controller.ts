import { Controller, Get, Param } from '@nestjs/common';
import { ArtistModel } from '../model/artist.model';
import { ArtistService } from '../service/artist.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('artists')
@ApiTags('Artists')
export class ArtistController {

  constructor(private artistService: ArtistService) { }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({ status: 200, description: 'All artists', type: [ArtistModel] })
  async getAllArtists(): Promise<ArtistModel[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an artist by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the artist' })
  @ApiResponse({ status: 200, description: 'The artist', type: ArtistModel })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async getArtist(@Param('id') id: string): Promise<ArtistModel | undefined> {
    return await this.artistService.findById(id);
  }

}