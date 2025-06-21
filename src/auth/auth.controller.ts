import { Controller, Post, Body } from '@nestjs/common';
import { AuthService }             from './auth.service';
import { Public }                  from './public.decorator';
import { RegisterUserDto }         from './dto/register-user.dto';

/**
 * AuthController
 *
 * Exposes authentication-related routes under the `/auth` path.
 * Uses AuthService for the core registration and login logic.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, // Injects the AuthService dependency
  ) {}

  /**
   * POST /auth/register
   *
   * Public endpoint to register a new user.
   * Skips global auth guards due to @Public decorator.
   *
   * @param userData - Validated registration payload
   * @returns The result of AuthService.register (token + user info)
   */
  @Public()
  @Post('register')
  async register(
    @Body() userData: RegisterUserDto, // DTO enforces email, password, and role validation
  ) {
    return this.authService.register(userData);
  }

  /**
   * POST /auth/login
   *
   * Public endpoint to authenticate an existing user.
   * Expects an object with `email` and `password`.
   *
   * @param credentials - Plain object with email & password
   * @returns The result of AuthService.login (token + user info)
   */
  @Public()
  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string }, // Inline type for login payload
  ) {
    return this.authService.login(credentials);
  }
}
