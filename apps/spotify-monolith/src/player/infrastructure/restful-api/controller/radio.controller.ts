import { Body, Controller, Post, Get , Param, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { RadioUseCases } from "../../../application/radio.use-cases";
import { CreateRadioRequest } from "../dto/create-radio.request";
import { EntityCreatedResponse } from "../dto/entity-created.response";
import { RadioModel } from "../../../domain/model/radio.model";

@Controller('radios')
@ApiTags('Radios')
export class RadioController {

  constructor(private radio: RadioUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create a new radio' })
  @ApiBody({ type: CreateRadioRequest})
  @ApiResponse({ status: 201, description: 'The new readio was created', type: EntityCreatedResponse })
  async create(@Body() request: CreateRadioRequest) {
    return await this.radio.create(request)
  }

  @Get('genre/:id')
  @ApiOperation({ summary: 'Get radios by genre ID' })
  @ApiParam({ name: 'id', description: 'The ID of the genre' })
  @ApiResponse({ status: 200, description: 'All radios by genre ID', type: [RadioModel] })
  async findByGenre(@Param('id') id: string): Promise<RadioModel[]> {
    return await this.radio.findByGenreId(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all radios' })
  @ApiResponse({ status: 200, description: 'All radios', type: [RadioModel] })
  async findAll(): Promise<RadioModel[]> {
    return await this.radio.findAll()
  }

}