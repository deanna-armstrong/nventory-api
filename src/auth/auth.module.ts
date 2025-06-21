import { Module } from '@nestjs/common';  
import { JwtModule } from '@nestjs/jwt';  
import { PassportModule } from '@nestjs/passport';  
import { MongooseModule } from '@nestjs/mongoose';  
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';  
import { AuthController } from './auth.controller';  
import { UsersModule } from '../users/users.module';  
import { User, UserSchema } from '../users/user.schema';  
import { JwtStrategy } from './jwt.strategy';

/**
 * AuthModule
 *
 * Centralizes all authentication-related providers and controllers.
 * - Registers the User schema with Mongoose.
 * - Integrates Passport.js for strategy-based auth.
 * - Configures JWT signing with dynamic secret/TTL.
 */
@Module({
  imports: [
    // Loads environment variables; since isGlobal is set in AppModule, 
    // this call will not re-read files but ensures ConfigService is available.
    ConfigModule.forRoot(),

    // Registers the Mongoose schema for User documents under the 'User' model name.
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Imports UsersModule so AuthService can inject user-related business logic.
    UsersModule,

    // Provides Passport.js middleware support; required for JwtStrategy to function.
    PassportModule,

    // Registers JWT module asynchronously to pull the signing secret from ConfigService.
    JwtModule.registerAsync({
      imports: [ConfigModule],               // Ensure ConfigService is available
      inject: [ConfigService],               // Inject ConfigService into the factory
      useFactory: async (config: ConfigService) => ({
        // Pull the JWT secret from environment (throws if missing)
        secret: config.get<string>('JWT_SECRET'),
        // Set token expiration; could be moved to env var (e.g. JWT_EXPIRES_IN)
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [
    AuthController, // Exposes /auth endpoints (register, login)
  ],
  providers: [
    AuthService,    // Handles hashing, validation, token creation
    JwtStrategy,    // Validates incoming JWTs on protected routes
  ],
})
export class AuthModule {}
