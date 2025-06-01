import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.schema';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Get('restock-suggestions')
  getRestock(): Promise<{ urgent: Inventory[], warning: Inventory[] }> {
  return this.inventoryService.getRestockSuggestions();
  }
  @Get(':id')
  @Roles(Role.Admin, Role.User)
  getOne(@Param('id') id: string): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() data: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryService.create(data);
  }

  @Put(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() data: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.inventoryService.delete(id);
  }
}
