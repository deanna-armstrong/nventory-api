import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel }       from '@nestjs/mongoose';
import { Model }             from 'mongoose';
import * as bcrypt           from 'bcrypt';
import { JwtService }        from '@nestjs/jwt';
import { ConfigService }     from '@nestjs/config';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  // Logger scoped to this service for debug and error messages
  private readonly logger = new Logger(AuthService.name);

  constructor(
    // Inject the Mongoose User model (typed as UserDocument for id & schema)
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    // JWT utility for signing and verifying tokens
    private readonly jwtService: JwtService,

    // Configuration service to pull secrets and TTL from environment
    private readonly configService: ConfigService,
  ) {}

  /**
   * Retrieves the JWT secret from environment.
   * Throws an error early if the secret is not defined.
   */
  private getJwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      // Fail fast if no secret is provided
      throw new Error('Missing JWT_SECRET in environment');
    }
    return secret;
  }

  /**
   * Retrieves token expiry setting, defaulting to '1h' if unset.
   * Allows optional override via JWT_EXPIRES_IN env var.
   */
  private getJwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') ?? '1h';
  }

  /**
   * Centralized JWT creation logic.
   * Uses user.id (string) for JWT subject and includes role claim.
   */
  private createAccessToken(user: UserDocument): string {
    // Define the JWT payload
    const payload = {
      username: user.email,
      sub: user.id,    // Mongoose Document has `id` getter
      role: user.role,
    };

    // Sign token with secret and TTL
    return this.jwtService.sign(payload, {
      secret: this.getJwtSecret(),
      expiresIn: this.getJwtExpiresIn(),
    });
  }

  /**
   * Handles new user registration.
   * - Validates presence of password
   * - Ensures email uniqueness
   * - Hashes password before persisting
   * - Generates and returns JWT + user data (excluding password)
   */
  async register(userData: Partial<User>) {
    // Ensure client provided a password
    if (!userData.password) {
      throw new BadRequestException('Password is required');
    }

    // Prevent duplicate accounts
    const exists = await this.userModel.findOne({ email: userData.email });
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    // Hash the plaintext password
    const hashed = await bcrypt.hash(userData.password, 10);

    // Create and save the new user document
    const created = new this.userModel({
      ...userData,
      password: hashed,
    });
    const savedUser = await created.save();

    // Generate JWT and strip password before returning
    const access_token = this.createAccessToken(savedUser);
    const { password, ...user } = savedUser.toObject();
    return { access_token, user };
  }

  /**
   * Authenticates an existing user.
   * - Fetches user with password field selected
   * - Verifies password match
   * - Returns JWT + user data (excluding password)
   */
  async login(credentials: { email: string; password: string }) {
    // Attempt to find the user and include the hashed password
    const userDoc = await this.userModel
      .findOne({ email: credentials.email })
      .select('+password');

    this.logger.debug(`Login attempt for: ${userDoc?.email}`);

    // Reject if user not found or no password on record
    if (!userDoc || !userDoc.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare provided password against stored hash
    const valid = await bcrypt.compare(credentials.password, userDoc.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT and remove password before returning
    const access_token = this.createAccessToken(userDoc);
    const { password, ...user } = userDoc.toObject();
    return { access_token, user };
  }
}
