import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: Partial<User>) {
    if (!userData.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
      const { password, ...result } = savedUser.toObject();
    return result;
  }


  async login(credentials: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: credentials.email }).lean();
    this.logger.debug(`User found for login: ${user?.email}`);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password, ...safeUser } = user;

    return {
      access_token: token,
      user: safeUser,
    };
  }
}
