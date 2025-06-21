import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './inventory.schema';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * InventoryModule
 *
 * Bundles together everything related to inventory management:
 * - Registers the Inventory schema with Mongoose
 * - Provides the InventoryService for business logic
 * - Exposes REST endpoints via InventoryController
 * - Integrates the NotificationsModule for sending alerts (e.g., low-stock notifications)
 */
@Module({
  imports: [
    // Registers the Inventory model: binds the Mongoose schema under the Inventory.name key
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),

    // Enables sending notifications when inventory events occur
    NotificationsModule,
  ],
  // Controllers handle incoming HTTP requests and delegate to the service layer
  controllers: [InventoryController],

  // Providers encapsulate business logic and data access for inventory
  providers: [InventoryService],
})
export class InventoryModule {}
