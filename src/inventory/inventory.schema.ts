import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Mongoose Document type combining our Inventory class and Mongoose’s Document interface.
 * Enables strong typing when working with inventory records in the database.
 */
export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt & updatedAt fields
export class Inventory {
  /** 
   * The name of the inventory item. 
   * Required for identifying items in listings and reports.
   */
  @Prop({ required: true })
  name: string;

  /**
   * Optional descriptive text about the item. 
   * Defaults to an empty string if not provided.
   */
  @Prop({ default: '' })
  description?: string;

  /**
   * The current count of how many units are in stock.
   * Must be zero or positive.
   */
  @Prop({ required: true, min: 0 })
  quantity: number;

  /**
   * Identifier for where the item is stored (e.g., warehouse or shelf).
   * Defaults to 'main-warehouse' for catch-all location.
   */
  @Prop({ default: 'main-warehouse' })
  location?: string;

  /**
   * Frequency (in days) at which this item should be reordered.
   * Note: you may adjust the unit or replace with a cron-like schedule.
   */
  @Prop({ default: 1 })
  reorderFrequency: number;

  /**
   * The threshold quantity that, when reached or fallen below,
   * should trigger a restock notification.
   */
  @Prop({ required: true, default: 5, min: 0 })
  reorderThreshold: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
