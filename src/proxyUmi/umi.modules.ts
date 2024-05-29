import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { UmiService } from './umi.service';
import { UmiController } from './umi.controller';

@Module({
  providers: [UmiService],
  controllers: [UmiController],
})
export class ProxyUmiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes(UmiController);
  }
}
