import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import { InventoryModule } from './inventory/inventory.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nventory'),
    InventoryModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}