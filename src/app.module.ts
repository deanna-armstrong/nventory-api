import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
=======
import { ConfigModule, ConfigService } from '@nestjs/config';
>>>>>>> b5fd09ab270e05b24c1d489f6529ee7f762e6d87
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import { InventoryModule } from './inventory/inventory.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
<<<<<<< HEAD
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
=======
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
>>>>>>> b5fd09ab270e05b24c1d489f6529ee7f762e6d87
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
