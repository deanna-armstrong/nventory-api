import { 
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
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
    private readonly jwtService: JwtService
  ) {}

  /** Register a new user and immediately return a JWT */
  async register(userData: Partial<User>) {
    if (!userData.password) {
      throw new BadRequestException('Password is required');
    }
    const existing = await this.userModel.findOne({ email: userData.email });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const payload = {
      username: savedUser.email,
      sub: savedUser._id,
      role: savedUser.role,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  /** Validate credentials, compare password, and return JWT + safe user */
  async login(credentials: { email: string; password: string }) {
    // Step 1: fetch the document *including* the password hash
    const userDoc = await this.userModel
      .findOne({ email: credentials.email })
      .select('+password');  // override schema-level select:false

    this.logger.debug(`User found for login: ${userDoc?.email}`);

    // Step 2: guard missing user or hash
    if (!userDoc || !userDoc.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 3: compare supplied password against hash
    const isValid = await bcrypt.compare(credentials.password, userDoc.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 4: create JWT and strip hash before returning
    const { password, ...user } = userDoc.toObject();
    const payload = { username: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user,  // contains email, role, _id, etc., but no password
    };
  }
}
