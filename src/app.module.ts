import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { ProxyUmiModule } from './proxyUmi/umi.modules';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
    CatsModule,
    ProxyUmiModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
