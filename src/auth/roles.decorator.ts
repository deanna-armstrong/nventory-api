import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key under which permitted roles are stored.
 * The RolesGuard will read this key to enforce access control.
 */
export const ROLES_KEY = 'roles';

/**
 * Roles decorator
 *
 * Attach this to controllers or route handlers to specify
 * which user roles are allowed to access the endpoint.
 *
 * @example
 * @Roles('admin', 'user')
 * @Get('profile')
 * getProfile() { … }
 *
 * @param roles - One or more role identifiers (e.g., 'admin', 'user')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
