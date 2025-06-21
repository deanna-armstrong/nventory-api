import { SetMetadata } from '@nestjs/common';

/**
 * Key for the metadata flag that marks routes as publicly accessible.
 * Used by JwtAuthGuard to bypass authentication when this flag is present.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route or entire controller as public.
 * When applied, JwtAuthGuard will skip JWT validation for that endpoint.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
