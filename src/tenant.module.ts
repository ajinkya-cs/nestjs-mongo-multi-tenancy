import { Global, Module } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Global()
@Module({
    providers: [TenantService],
    exports: [TenantService],
})
export class TenantModule {}
