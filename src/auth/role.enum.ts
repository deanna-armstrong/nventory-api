/**
 * Defines the possible user roles for role-based access control (RBAC).
 * Guards and decorators reference these values to enforce authorization policies.
 */
export enum Role {
  /** Administrative user with full privileges over resources and endpoints */
  Admin = 'admin',

  /** Standard user with restricted access to their own resources and permitted actions */
  User  = 'user',
}
