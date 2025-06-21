// src/notifications/notifications.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

/**
 * NotificationsModule
 *
 * Bundles all notification-related functionality:
 * - Registers the Notification schema with Mongoose for DB interactions
 * - Provides NotificationsService for business logic (create, read, update)
 * - Exposes HTTP routes via NotificationsController
 * - Exports NotificationsService so other modules (e.g., InventoryModule) can send notifications
 */
@Module({
  imports: [
    // Register the Notification model in this module’s Mongoose context
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [
    // Handles incoming API requests for notifications
    NotificationsController,
  ],
  providers: [
    // Encapsulates notification business logic and DB operations
    NotificationsService,
  ],
  exports: [
    // Allows other modules to inject NotificationsService (e.g., to trigger alerts)
    NotificationsService,
  ],
})
export class NotificationsModule {}
