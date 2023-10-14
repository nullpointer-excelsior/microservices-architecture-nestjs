import { Controller, Get, Param } from '@nestjs/common';
import { GenreModel } from '../model/genre.model';
import { GenreService } from '../service/genre.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('genres')
@ApiTags('Genres')
export class GenreController {

  constructor(private genreService: GenreService) { }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, description: 'All genres', type: [GenreModel] })
  async findAll(): Promise<GenreModel[]> {
    return await this.genreService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the genre' })
  @ApiResponse({ status: 200, description: 'The genre', type: GenreModel })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  async findById(@Param('id') id: string): Promise<GenreModel | undefined> {
    return await this.genreService.findById(id);
  }

}