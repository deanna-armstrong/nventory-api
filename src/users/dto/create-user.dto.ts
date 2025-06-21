// src/users/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object for creating a new user.
 * Used in protected internal/admin endpoints to provision user accounts.
 * Validates that email, password, and role are provided and correctly formatted.
 */
export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  // The user's unique login identifier
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  // Plaintext password to be hashed before storage
  password: string;

  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  // Defines the user's permission scope (e.g., 'user' or 'admin')
  role: string;
}
