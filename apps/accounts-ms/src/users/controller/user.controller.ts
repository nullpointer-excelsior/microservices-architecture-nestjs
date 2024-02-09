import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { UserModel } from '../model/user.model';

@Controller('users')
@ApiTags('Users')
export class UserController {

  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users', type: [UserModel] })
  async findAll(): Promise<UserModel[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'The user', type: UserModel })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserModel | undefined> {
    return await this.userService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserModel })
  @ApiResponse({ status: 201, description: 'The new user', type: UserModel })
  async create(@Body() user: UserModel): Promise<UserModel> {
    return await this.userService.create(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiBody({ type: UserModel })
  @ApiResponse({ status: 200, description: 'The updated user', type: UserModel })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() user: UserModel): Promise<UserModel> {
    return await this.userService.update(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }

}
