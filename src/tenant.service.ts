import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Partner } from './partner.schema';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
    private tenantModels: Record<string, Model<any>> = {};

    constructor(@InjectConnection() private readonly connection: Connection) {}

    async getModel<T>(tenantId: string, schema: any, collectionPrefix: string): Promise<Model<T>> {
        if (!this.tenantModels[tenantId]) {
            const partner = await this.connection.model<Partner>('Partner').findOne({ uuid: tenantId }).exec();
            if (!partner) throw new Error('Invalid tenant');

            const collectionName = `${collectionPrefix}_${partner.name}`;
            this.tenantModels[tenantId] = this.connection.model(collectionName, schema);
        }
        return this.tenantModels[tenantId] as Model<T>;
    }
}
