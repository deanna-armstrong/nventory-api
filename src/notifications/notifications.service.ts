import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>
  ) {}

  async create(notification: Partial<Notification>): Promise<Notification | null> {
  const exists = await this.notificationModel.findOne({
    itemId: notification.itemId,
    type: notification.type,
    read: false,
  });

  if (exists) {
    
    return null;
  }

  return this.notificationModel.create(notification);
}

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().sort({ timestamp: -1 });
  }

async markAsRead(id: string): Promise<Notification | null> {
  return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
}

async markAllAsReadForItem(itemId: string, type: string): Promise<void> {
  await this.notificationModel.updateMany(
    { itemId, type, read: false },
    { $set: { read: true } }
  );
}
}