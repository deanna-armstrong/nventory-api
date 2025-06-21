// src/users/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document }                    from 'mongoose';

/**
 * Combines the User schema with Mongoose’s Document interface
 * to include both custom properties and Mongoose document methods/fields.
 */
export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt & updatedAt timestamps
export class User {
  /**
   * User's login identifier.
   * - Must be unique across all users.
   * - Required for authentication and notifications.
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * Hashed password field.
   * - Required for authentication.
   * - Excluded from queries by default (`select: false`) for security.
   */
  @Prop({ required: true, select: false })
  password: string;

  /**
   * Role for role-based access control (e.g., 'admin' or 'user').
   * - Required to enforce authorization rules.
   */
  @Prop({ required: true })
  role: string;
}

// Generates the Mongoose schema based on the User class definition
export const UserSchema = SchemaFactory.createForClass(User);
