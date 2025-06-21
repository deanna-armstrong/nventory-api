// src/users/users.module.ts

import { Module } from '@nestjs/common';
// MongooseModule allows us to register Mongoose schemas for dependency injection
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';

/**
 * UsersModule
 *
 * Bundles everything related to user management:
 * - Registers the User schema with Mongoose for DB operations
 * - Provides UsersService for user-related business logic
 * - Exposes HTTP endpoints via UsersController
 * - Exports UsersService so it can be injected into other modules (e.g., AuthModule)
 */
@Module({
  imports: [
    // Register the User model under the 'User' name with the provided schema
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    // Handles incoming requests for user operations (CRUD, etc.)
    UsersController,
  ],
  providers: [
    // Encapsulates all user-related business logic and DB access
    UsersService,
  ],
  exports: [
    // Makes UsersService available to any module that imports UsersModule
    UsersService,
  ],
})
export class UsersModule {}
