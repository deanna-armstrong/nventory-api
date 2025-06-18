import { IsEmail, IsString, IsEnum } from 'class-validator';
import { Role } from '../role.enum'; // adjust path if needed

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role, { message: 'Role must be either user or admin' })
  role: Role;
}