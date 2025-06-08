import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop()
  body: string;

  @Prop({ required: true, enum: ['LOW_STOCK', 'INFO', 'WARNING'], default: 'INFO' })
  type: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: false })
  read: boolean;

  @Prop({ type: String })  // Optional: reference to item ID
  itemId?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ itemId: 1, type: 1, read: 1 });