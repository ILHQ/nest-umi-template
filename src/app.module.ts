import { Module } from '@nestjs/common';
import { ProxyUmiModule } from './proxyUmi/umi.modules';

@Module({
  imports: [ProxyUmiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
