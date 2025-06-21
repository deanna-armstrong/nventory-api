import { IsEmail, IsString, IsEnum } from 'class-validator';
import { Role } from '../role.enum';

/**
 * Data Transfer Object for user registration.
 * Ensures incoming payload is validated before reaching the service layer.
 */
export class RegisterUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  // The user's unique identifier used for login and notifications
  email: string;

  @IsString({ message: 'Password must be a string' })
  // Consider adding @MinLength or @Matches for stronger password policies
  password: string;

  @IsEnum(Role, { message: 'Role must be either "user" or "admin"' })
  // Defines the permission scope: regular user vs. administrator
  role: Role;
}
