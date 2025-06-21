import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory }        from './inventory.schema';
import { JwtAuthGuard }     from '../auth/jwt.auth.guard';
import { Roles }            from '../auth/roles.decorator';
import { RolesGuard }       from '../auth/roles.guard';
import { Role }             from '../auth/role.enum';

/**
 * InventoryController
 *
 * Exposes endpoints for managing inventory items:
 * - CRUD operations under `/inventory`
 * - Specialized “restock suggestions” query
 *
 * All routes require a valid JWT and role-based authorization.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    // Injects the InventoryService to handle business logic and data access
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * GET /inventory
   *
   * Returns the full list of inventory items.
   * Accessible to both Admin and regular User roles.
   */
  @Get()
  @Roles(Role.Admin, Role.User)
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  /**
   * GET /inventory/restock-suggestions
   *
   * Provides separate arrays of items needing urgent restock and items nearing low stock.
   * Useful for dashboard displays or automated alerts.
   * Open to both Admin and User roles by virtue of class-level guards, though no @Roles decorator means default allow.
   */
  @Get('restock-suggestions')
  getRestock(): Promise<{ urgent: Inventory[]; warning: Inventory[] }> {
    return this.inventoryService.getRestockSuggestions();
  }

  /**
   * GET /inventory/:id
   *
   * Retrieves a single inventory item by its MongoDB ObjectId.
   * Accessible to both Admin and User roles.
   *
   * @param id - The unique identifier of the inventory item
   */
  @Get(':id')
  @Roles(Role.Admin, Role.User)
  getOne(@Param('id') id: string): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  /**
   * POST /inventory
   *
   * Creates a new inventory item.
   * Restricted to Admin role only.
   *
   * @param data - Partial<Inventory> object; consider defining a CreateInventoryDto for stronger validation
   */
  @Post()
  @Roles(Role.Admin)
  create(@Body() data: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryService.create(data);
  }

  /**
   * PUT /inventory/:id
   *
   * Updates an existing inventory item by id.
   * Restricted to Admin role only.
   *
   * @param id   - The identifier of the item to update
   * @param data - Partial<Inventory> containing the fields to change
   */
  @Put(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() data: Partial<Inventory>,
  ): Promise<Inventory> {
    return this.inventoryService.update(id, data);
  }

  /**
   * DELETE /inventory/:id
   *
   * Removes an inventory item permanently.
   * Restricted to Admin role only.
   *
   * @param id - The identifier of the item to delete
   */
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.inventoryService.delete(id);
  }
}
