import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard }                     from '@nestjs/passport';
import { Reflector }                     from '@nestjs/core';
import { IS_PUBLIC_KEY }                 from './public.decorator';

/**
 * JwtAuthGuard
 *
 * Extends Nest’s built-in Passport AuthGuard for the 'jwt' strategy,
 * and allows marking routes as public via a custom decorator.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Overrides default canActivate to skip JWT validation
   * for routes marked with @Public()
   */
  canActivate(context: ExecutionContext) {
    // Check if the handler or class has @Public() metadata
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(), // method-level
        context.getClass(),   // controller-level
      ],
    );

    // If marked public, bypass the JWT guard entirely
    if (isPublic) {
      return true;
    }

    // Otherwise, use the standard JWT validation flow
    return super.canActivate(context);
  }
}
