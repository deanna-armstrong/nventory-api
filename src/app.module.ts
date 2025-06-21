// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule }               from '@nestjs/mongoose';
import { APP_GUARD }                    from '@nestjs/core';

import { InventoryModule } from './inventory/inventory.module';
import { UsersModule }     from './users/users.module';
import { AuthModule }      from './auth/auth.module';

import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { RolesGuard }   from './auth/roles.guard';

/**
 * AppModule
 *
 * Root module that bootstraps the application.
 * - Loads environment variables globally.
 * - Configures MongoDB connection.
 * - Registers feature modules: Inventory, Users, Auth.
 * - Applies global guards for JWT authentication and role-based authorization.
 */
@Module({
  imports: [
    // Load .env or .env.production based on NODE_ENV
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available across all modules
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env',
    }),

    // Asynchronously configure Mongoose using ConfigService for the URI
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigService is available
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'), // Pull MONGO_URI from environment
      }),
      inject: [ConfigService],
    }),

    // Feature modules encapsulating domain logic
    InventoryModule, // Inventory management (CRUD, restock logic)
    UsersModule,     // User management (CRUD, validation)
    AuthModule,      // Authentication (register, login, JWT)
  ],
  providers: [
    {
      provide: APP_GUARD,     // Apply JwtAuthGuard globally
      useClass: JwtAuthGuard, // Protects all routes by default
    },
    {
      provide: APP_GUARD,     // Apply RolesGuard globally
      useClass: RolesGuard,   // Enforces @Roles metadata on routes
    },
  ],
})
export class AppModule {}
