import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Sets up the JWT strategy for Passport.
   * - Pulls the signing secret from ConfigService.
   * - Configures token extraction from the Authorization header.
   * - Enforces token expiration.
   */
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      // Fail fast on missing secret to avoid runtime misconfigurations
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      // Extract JWT from the Authorization: Bearer <token> header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Do not allow expired tokens
      ignoreExpiration: false,
      // Secret used to verify token signature
      secretOrKey: secret,
    });
  }

  /**
   * Called once the JWT payload has been validated.
   * Maps the JWT claims to a user object attached to request.user.
   *
   * @param payload - Decoded JWT payload
   * @returns An object representing the authenticated user context
   */
  async validate(payload: { sub: string; username: string; role: string }) {
    return {
      userId: payload.sub,        // Unique user identifier (subject)
      email: payload.username,    // User's email from token claim
      role: payload.role,         // User's role claim for authorization
    };
  }
}
