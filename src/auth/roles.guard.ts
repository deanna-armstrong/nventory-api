import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector }                                  from '@nestjs/core';

/**
 * RolesGuard
 *
 * Guard that enforces role-based access control (RBAC) by reading
 * the `roles` metadata set via the @Roles decorator on controllers
 * or route handlers.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines whether the current request is allowed based on user role.
   *
   * @param context - ExecutionContext provides request details
   * @returns `true` if access is permitted, `false` otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    // Retrieve the list of roles required for this endpoint, if any
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      'roles',                               // metadata key (matches @Roles())
      [context.getHandler(), context.getClass()], // check method then controller
    );

    // If no roles were specified, allow unrestricted access
    if (!requiredRoles) {
      return true;
    }

    // Extract the request object and the authenticated user (populated by JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Deny if there's no user or they lack a role property
    if (!user || typeof user.role !== 'string') {
      console.warn('RolesGuard: missing user or role on request');
      return false;
    }

    // Grant access if the user's role matches one of the required roles
    return requiredRoles.includes(user.role);
  }
}
