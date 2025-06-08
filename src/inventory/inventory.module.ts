import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './inventory.schema';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { NotificationsModule } from '../notifications/notifications.module'; // <-- Add this

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema }
    ]),
    NotificationsModule // <-- This is REQUIRED
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}