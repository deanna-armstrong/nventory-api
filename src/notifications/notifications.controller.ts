// src/notifications/notifications.controller.ts

import { Controller, Get, Put, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

/**
 * NotificationsController
 *
 * Handles HTTP routes for fetching and updating notifications.
 */
@Controller('notifications')
export class NotificationsController {
  constructor(
    // Inject the NotificationsService to delegate business logic
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * GET /notifications
   *
   * Returns all notifications in the system.
   * @returns Promise resolving to an array of notifications
   */
  @Get()
  async getAll() {
    return this.notificationsService.findAll();
  }

  /**
   * PUT /notifications/:id/read
   *
   * Marks a specific notification as read.
   *
   * @param id - The identifier of the notification to update
   * @returns Promise resolving to the updated notification
   */
  @Put(':id/read')
  async markAsRead(
    @Param('id') id: string, // Extracts the :id parameter from the request URL
  ) {
    return this.notificationsService.markAsRead(id);
  }
}
