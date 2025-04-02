import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
    private models = new Map<string, Model<any>>();

    constructor(
        @InjectConnection() private readonly connection: Connection) {}

    getModel<T>(schema: any, prefix: string, tenantId: string): Model<T> {
        const modelName = `${prefix}_${tenantId}`;

        if (!this.models.has(modelName)) {
            const newModel = this.connection.model<T>(modelName, schema);
            this.models.set(modelName, newModel);
        }

        return this.models.get(modelName) as Model<T>;
    }
}
