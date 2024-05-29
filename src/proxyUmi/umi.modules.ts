import { Module } from '@nestjs/common';
import { UmiService } from './umi.service';
import { UmiController } from './umi.controller';

@Module({
  providers: [UmiService],
  controllers: [UmiController],
})
export class ProxyUmiModule {}
