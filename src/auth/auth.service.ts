import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger
} from '@nestjs/common';
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
<<<<<<< HEAD
      throw new BadRequestException('Password is required');
    }

    const existing = await this.userModel.findOne({ email: userData.email });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

=======
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
>>>>>>> b5fd09ab270e05b24c1d489f6529ee7f762e6d87
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
<<<<<<< HEAD

    const payload = {
      username: savedUser.email,
      sub: savedUser._id,
      role: savedUser.role,
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
=======
      const { password, ...result } = savedUser.toObject();
    return result;
>>>>>>> b5fd09ab270e05b24c1d489f6529ee7f762e6d87
  }


  async login(credentials: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: credentials.email }).lean();
<<<<<<< HEAD
=======
    this.logger.debug(`User found for login: ${user?.email}`);
>>>>>>> b5fd09ab270e05b24c1d489f6529ee7f762e6d87

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
<<<<<<< HEAD

=======
>>>>>>> b5fd09ab270e05b24c1d489f6529ee7f762e6d87
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

<<<<<<< HEAD
    const payload = {
      username: user.email,
      sub: user._id,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
=======
    const payload = { username: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password, ...safeUser } = user;

    return {
      access_token: token,
      user: safeUser,
    };
>>>>>>> b5fd09ab270e05b24c1d489f6529ee7f762e6d87
  }
}
