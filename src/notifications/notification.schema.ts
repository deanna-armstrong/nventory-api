import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document }                    from 'mongoose';

/**
 * Mongoose Document type combining our Notification class and Mongoose’s Document interface.
 * Provides full typing for Notification records including Mongoose-specific fields (e.g., _id, id).
 */
export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  /**
   * Short, descriptive title for the notification.
   * Required to identify the notification in lists and UI components.
   */
  @Prop({ required: true })
  title: string;

  /**
   * Detailed message body explaining the context or details of the notification.
   * Optional; defaults to an empty string if not provided.
   */
  @Prop({ default: '' })
  body?: string;

  /**
   * Notification category:
   * - 'LOW_STOCK' for inventory alerts
   * - 'INFO' for general messages
   * - 'WARNING' for cautionary notices
   *
   * Defaults to 'INFO'.
   */
  @Prop({
    required: true,
    enum: ['LOW_STOCK', 'INFO', 'WARNING'],
    default: 'INFO',
  })
  type: 'LOW_STOCK' | 'INFO' | 'WARNING';

  /**
   * Timestamp of when the notification was created.
   * Auto-populated by Mongoose if using `timestamps: true`; 
   * fallback default ensures a value even if timestamps disabled.
   */
  @Prop({ default: Date.now })
  timestamp: Date;

  /**
   * Flag indicating whether the user has marked this notification as read.
   * Used to filter unread notifications for display.
   */
  @Prop({ default: false })
  read: boolean;

  /**
   * Optional reference to the related inventory item (by ID).
   * Enables linking notifications back to specific items.
   */
  @Prop({ type: String })
  itemId?: string;
}

// Create the Mongoose schema from the Notification class definition
export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Compound index to optimize queries for unread notifications by item and type
NotificationSchema.index({ itemId: 1, type: 1, read: 1 });
