// src/users/users.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel }                     from '@nestjs/mongoose';
import { Model }                           from 'mongoose';
import * as bcrypt                         from 'bcrypt';
import { User, UserDocument }              from './user.schema';

@Injectable()
export class UsersService {
  /**
   * Injects the Mongoose User model for DB operations.
   */
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a new user.
   * - Validates presence of a password.
   * - Hashes the password with bcrypt before storage.
   *
   * @param userData - Partial user data containing at minimum email and password.
   * @returns The newly created User document.
   * @throws BadRequestException if password is missing.
   */
  async create(userData: Partial<User>): Promise<User> {
    // Ensure client provided a password
    if (!userData.password) {
      throw new BadRequestException('Password is required');
    }

    // Hash the plaintext password for secure storage
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Instantiate a new User document with the hashed password
    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    // Persist to the database
    return createdUser.save();
  }

  /**
   * Finds a user by their email address.
   *
   * @param email - The email to search for.
   * @returns A User document or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Validates user credentials.
   * - Retrieves the user by email.
   * - Compares provided password against stored hash.
   * - Strips password before returning user data.
   *
   * Note: Ensure `password` is selected in queries (schema sets select:false by default).
   *
   * @param email - The user’s email.
   * @param password - The plaintext password to verify.
   * @returns The user data without password or null if validation fails.
   */
  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    // Explicitly include password field for comparison
    const userDoc = await this.userModel
      .findOne({ email })
      .select('+password') // override schema select:false
      .exec();

    // If user exists and password matches
    if (userDoc && await bcrypt.compare(password, userDoc.password)) {
      // Convert to plain object and remove the password property
      const { password: _, ...userWithoutPassword } = userDoc.toObject();
      return userWithoutPassword;
    }

    // Return null to signal invalid credentials
    return null;
  }
}
