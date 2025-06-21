// src/notifications/notifications.service.ts

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel }                    from '@nestjs/mongoose';
import { Model }                          from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationsService {
  /**
   * Injects the Mongoose model for Notification documents.
   * Used to perform create, read, and update operations on the notifications collection.
   */
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  /**
   * Creates a new notification if one of the same type for the same item is not already unread.
   *
   * @param notification - Partial notification data (title, body, type, itemId, etc.)
   * @returns The created Notification, or null if a duplicate unread notification exists
   */
  async create(
    notification: Partial<Notification>,
  ): Promise<Notification | null> {
    // Check for an existing unread notification to avoid duplicates
    const exists = await this.notificationModel.findOne({
      itemId: notification.itemId,
      type: notification.type,
      read: false,
    });

    if (exists) {
      // Skip creation if an active notification already exists
      return null;
    }

    // Persist the new notification document
    return this.notificationModel.create(notification);
  }

  /**
   * Retrieves all notifications, sorted by newest first.
   *
   * @returns An array of Notification documents
   */
  async findAll(): Promise<Notification[]> {
    return this.notificationModel
      .find()
      .sort({ timestamp: -1 }) // Sort descending by timestamp
      .exec();
  }

  /**
   * Marks a single notification as read.
   *
   * @param id - The ObjectId of the notification to update
   * @returns The updated Notification document, or null if not found
   */
  async markAsRead(id: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(
        id,
        { read: true },       // Set the read flag
        { new: true },        // Return the updated document
      )
      .exec();
  }

  /**
   * Marks all unread notifications of a given type for a specific item as read.
   *
   * @param itemId - The identifier of the related inventory item
   * @param type   - Notification type to filter (e.g., 'LOW_STOCK')
   */
  async markAllAsReadForItem(itemId: string, type: string): Promise<void> {
    await this.notificationModel
      .updateMany(
        { itemId, type, read: false }, // Filter only unread notifications matching item & type
        { $set: { read: true } },      // Bulk update: mark them read
      )
      .exec();
  }
}
