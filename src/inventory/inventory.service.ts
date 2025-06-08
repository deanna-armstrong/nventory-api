import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './inventory.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { PriorityQueue } from '../utils/priority-queue';
import { environment } from '../environments/environment';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
    private readonly notificationsService: NotificationsService
  ) {}

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }

  async findOne(id: string): Promise<Inventory> {
    const item = await this.inventoryModel.findById(id).exec();
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async create(data: Partial<Inventory>): Promise<Inventory> {
    const newItem = new this.inventoryModel(data);
    return newItem.save();
  }

  async update(id: string, data: Partial<Inventory>): Promise<Inventory> {
  const updated = await this.inventoryModel.findByIdAndUpdate(id, data, { new: true }) as InventoryDocument;
  if (!updated) throw new NotFoundException('Item not found');

  const qty = updated.quantity ?? 0;
  const threshold = updated.reorderThreshold ?? 1;

  if (qty <= threshold) {
    const notification = await this.notificationsService.create({
      title: `Low stock for ${updated.name}`,
      body: `${updated.name} has fallen below the threshold of ${threshold}.`,
      type: 'LOW_STOCK',
      itemId: String(updated._id)
    });

    if (notification) {
      console.log('Notification created:', notification.title);
    } else {
      console.log('Skipped duplicate LOW_STOCK notification for', updated.name);
    }

  } else {

    await this.notificationsService.markAllAsReadForItem(String(updated._id), 'LOW_STOCK');
  }

  return updated;
}

  async delete(id: string): Promise<void> {
    const result = await this.inventoryModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Item not found');
  }

  async getRestockSuggestions(): Promise<{ urgent: Inventory[], warning: Inventory[] }> {
  const inventoryItems = await this.inventoryModel.find().exec();

  const urgent: Inventory[] = [];
  const warning: Inventory[] = [];

  for (const item of inventoryItems) {
    const qty = item.quantity ?? 0;
    const threshold = item.reorderThreshold ?? 1;

    if (qty <= threshold) {
      urgent.push(item);
    } else if (qty <= threshold + 2) {
      warning.push(item);
    }
  }
  console.log('Returning suggestions:', { urgent, warning });
  return { urgent, warning };
}
}
