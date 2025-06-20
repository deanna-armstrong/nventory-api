import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public }            from './public.decorator';
import { RegisterUserDto } from './dto/register-user.dto'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() userData: RegisterUserDto) {
  return this.authService.register(userData);
}

  @Public()
  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.login(credentials);
  }
}
