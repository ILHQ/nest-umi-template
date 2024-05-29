import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Module({
  providers: [CatsService],
  controllers: [CatsController],
  exports: [CatsService],
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
