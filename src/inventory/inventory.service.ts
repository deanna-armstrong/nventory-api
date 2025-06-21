import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel }                  from '@nestjs/mongoose';
import { Model }                        from 'mongoose';
import { Inventory, InventoryDocument } from './inventory.schema';
import { NotificationsService }         from '../notifications/notifications.service';
import { PriorityQueue }                from '../utils/priority-queue'; // ← UNUSED: consider removing if not needed

/**
 * InventoryService
 *
 * Encapsulates all business logic for inventory management:
 * - CRUD operations against MongoDB
 * - Restock threshold checks with notifications
 * - Restock suggestion computations
 */
@Injectable()
export class InventoryService {
  constructor(
    // Inject Mongoose model for Inventory documents
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
    // Inject service to send or update notifications
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Fetches all inventory items.
   * @returns a promise resolving to an array of Inventory records
   */
  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }

  /**
   * Fetches a single inventory item by its ID.
   * Throws NotFoundException if the item does not exist.
   *
   * @param id - MongoDB ObjectId string
   * @returns the Inventory record
   */
  async findOne(id: string): Promise<Inventory> {
    const item = await this.inventoryModel.findById(id).exec();
    if (!item) {
      // Inform client that the requested resource is missing
      throw new NotFoundException(`Inventory item with id ${id} not found`);
    }
    return item;
  }

  /**
   * Creates a new inventory record.
   * Ideally, validate `data` against a CreateInventoryDto before calling.
   *
   * @param data - partial Inventory fields
   * @returns the newly created Inventory document
   */
  async create(data: Partial<Inventory>): Promise<Inventory> {
    const newItem = new this.inventoryModel(data);
    return newItem.save();
  }

  /**
   * Updates an existing inventory item and manages low-stock notifications.
   * - Sends a LOW_STOCK notification if quantity <= threshold.
   * - Clears previous LOW_STOCK notifications if stock is sufficient.
   *
   * @param id   - the item’s ObjectId
   * @param data - fields to update
   * @returns the updated Inventory document
   */
  async update(id: string, data: Partial<Inventory>): Promise<Inventory> {
    // atomically find and update, returning the new document
    const updated = await this.inventoryModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    ) as InventoryDocument;

    if (!updated) {
      throw new NotFoundException(`Cannot update; item with id ${id} not found`);
    }

    const qty       = updated.quantity ?? 0;
    const threshold = updated.reorderThreshold ?? 1;

    if (qty <= threshold) {
      // Trigger a low-stock notification
      const notification = await this.notificationsService.create({
    title: `Low stock for ${updated.name}`,
    body: `${updated.name} has fallen below threshold of ${threshold}.`,
    type: 'LOW_STOCK',
    itemId: updated.id,
  });

  // Guard against a null return value before accessing properties
  if (notification) {
    console.log('Notification created:', notification.title);
  } else {
    console.log('Skipped duplicate LOW_STOCK notification for', updated.name);
  }
} else {
  // Clear prior low-stock alerts now that stock is back above threshold
  await this.notificationsService.markAllAsReadForItem(
    updated.id,
    'LOW_STOCK',
  );
}

    return updated;
  }

  /**
   * Deletes an inventory item by ID.
   * Throws NotFoundException if the item does not exist.
   *
   * @param id - the item’s ObjectId
   */
  async delete(id: string): Promise<void> {
    const result = await this.inventoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Cannot delete; item with id ${id} not found`);
    }
  }

  /**
   * Computes restock suggestions:
   * - urgent: items <= threshold
   * - warning: items <= threshold + 2
   *
   * @returns separate arrays for urgent and warning suggestions
   */
  async getRestockSuggestions(): Promise<{
    urgent: Inventory[];
    warning: Inventory[];
  }> {
    const items = await this.inventoryModel.find().exec();
    const urgent: Inventory[]  = [];
    const warning: Inventory[] = [];

    for (const item of items) {
      const qty       = item.quantity ?? 0;
      const threshold = item.reorderThreshold ?? 1;

      if (qty <= threshold) {
        urgent.push(item);
      } else if (qty <= threshold + 2) {
        warning.push(item);
      }
    }

    // Consider using a priority queue for large datasets or more complex ranking
    console.log('Returning restock suggestions:', { urgent, warning });
    return { urgent, warning };
  }
}
