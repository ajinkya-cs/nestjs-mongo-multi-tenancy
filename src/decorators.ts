import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { TenantService } from './tenant.service';

export const TenantId = createParamDecorator((_, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-tenant-id'];
});

export const TenantModel = (schema: any, collectionPrefix: string) =>
    Inject(async (tenantService: TenantService, ctx: ExecutionContext) => {
        const tenantId = ctx.switchToHttp().getRequest().headers['x-tenant-id'];
        return tenantService.getModel(tenantId, schema, collectionPrefix);
    });
