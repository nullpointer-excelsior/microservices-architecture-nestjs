import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayListUseCases } from '../../../application/playlists.use-cases';
import { PlaylistModel } from '../../../domain/model/playlist.model';
import { CreatePlayListRequest } from '../model/create-playlist.request';

@Controller('playlists')
@ApiTags('Playlists')
export class PlaylistController {

  constructor(private playListUseCases: PlayListUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create a new playlist' })
  @ApiBody({ type: CreatePlayListRequest})
  @ApiResponse({ status: 201, description: 'The new playlist ID', type: PlaylistModel })
  async create(@Body() dto: CreatePlayListRequest): Promise<PlaylistModel> {
    return await this.playListUseCases.create(dto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all playlists by user ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'All playlists by user ID', type: [PlaylistModel] })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUserId(@Param('id') id: string): Promise<PlaylistModel[]> {
    return await this.playListUseCases.findByUserId(id);
  }

}
