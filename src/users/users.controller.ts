// src/users/users.controller.ts

import { Controller } from '@nestjs/common';

/**
 * UsersController
 *
 * Exposes endpoints under the `/users` path for user management operations.
 * Currently a scaffold—add methods to handle user-specific HTTP requests:
 * - GET /users
 * - GET /users/:id
 * - PUT /users/:id
 * - DELETE /users/:id
 */
@Controller('users')
export class UsersController {
  // TODO: Inject UsersService and implement handler methods here.
  // Example:
  //
  // constructor(private readonly usersService: UsersService) {}
  //
  // @Get()
  // async findAll(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }
  //
  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<User> {
  //   return this.usersService.findOne(id);
  // }
}
