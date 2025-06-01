import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<any> {
  const user = await this.userModel.findOne({ email }).exec();
  if (user && await bcrypt.compare(password, user.password)) {
    const userObj = user.toObject(); // Works because it's a Mongoose Document
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
  return null;
}
}
