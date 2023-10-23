import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateArtistRequest } from '../dto/create-artist.request';
import { ArtistModel } from '../model/artist.model';
import { ArtistService } from '../service/artist.service';

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

  @Post()
  @ApiOperation({ summary: 'Create a artist' })
  @ApiBody({ description: 'The artist to create', type: CreateArtistRequest })
  @ApiResponse({ status: 201, description: 'The newly created artist', type: CreateArtistRequest })
  create(@Body() createArtist: CreateArtistRequest) {
    return this.artistService.save(createArtist)
  }

  @Put()
  @ApiOperation({ summary: 'Update a artist' })
  @ApiBody({ description: 'The artist to update', type: ArtistModel})
  @ApiResponse({ status: 201, description: 'The artist updated', type: ArtistModel})
  update(@Body() artist: ArtistModel) {
    return this.artistService.update(artist)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an artist' })
  @ApiResponse({ status: 200, description: 'The artist deleted' })
  delete(@Param('id') id: string) {
    return this.artistService.delete(id)
  }

}