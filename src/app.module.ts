import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { ProxyUmiModule } from './proxyUmi/umi.modules';

@Module({
  imports: [CatsModule, ProxyUmiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
