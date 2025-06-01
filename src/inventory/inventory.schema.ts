import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema()
export class Inventory {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  location: string;

   @Prop({ required: false, default: 1 })
  reorderFrequency: number;

  @Prop({ required: true, default: 5 }) // you can adjust the default
  reorderThreshold: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
