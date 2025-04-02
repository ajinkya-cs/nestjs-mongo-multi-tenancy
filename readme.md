# NestJS MongoDB Multi-Tenancy

A plug-and-play NestJS package for handling multi-tenancy with MongoDB.

## Features
- Automatic tenant-based MongoDB model creation
- Decorators to inject tenant-aware models
- Caching for efficient tenant resolution
- Fully compatible with NestJS & Mongoose
- Supports per-tenant database segregation

## Installation
```sh
npm install nestjs-mongo-multi-tenancy mongoose @nestjs/mongoose
```

## Use Cases

### 1. SaaS Platforms
Multi-tenant SaaS applications where each customer has their own isolated data while sharing a common application backend.

### 2. Multi-Brand Systems
Applications supporting multiple brands, where each brand operates in an independent data space.

### 3. Enterprise-Level Multi-Tenant Apps
Businesses that need segregated data access based on clients, divisions, or regions.

## Usage

### Import `TenantModule`
```ts
import { Module } from '@nestjs/common';
import { TenantModule } from 'nestjs-mongo-multi-tenancy';

@Module({
  imports: [TenantModule.forRoot('mongodb://your-mongo-uri')],
})
export class AppModule {}
```

### Use `TenantModel` Decorator
```ts
import { Injectable } from '@nestjs/common';
import { TenantModel } from 'nestjs-mongo-multi-tenancy';
import mongoose, { Model } from 'mongoose';

const DataSchema = new mongoose.Schema({ name: String, createdAt: { type: Date, default: Date.now } });

@Injectable()
export class DataService {
  @TenantModel('Data', DataSchema)
  private readonly dataModel: Model<any>;

  async create(name: string) {
    return this.dataModel.create({ name });
  }

  async findAll() {
    return this.dataModel.find().exec();
  }
}
```

### Use `TenantId` Decorator
```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { TenantId } from 'nestjs-mongo-multi-tenancy';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  async create(@Body('name') name: string) {
    return this.dataService.create(name);
  }

  @Get()
  async getAll(@TenantId() tenantId: string) {
    console.log(`Fetching data for tenant: ${tenantId}`);
    return this.dataService.findAll();
  }
}
```

### API Call Example
```sh
curl -X POST http://localhost:3000/data \
  -H "x-tenant-id: abc123" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Test Entry" }'
```

```sh
curl -X GET http://localhost:3000/data \
  -H "x-tenant-id: abc123"
```

## License
MIT

