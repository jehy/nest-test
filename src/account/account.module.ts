import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { configService } from '../config/config.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Currency } from '../currency/currency.entity';
import { CurrencyService } from '../currency/currency.service';
import { CurrencyCourseService } from '../currencyCourse/currencyCourse.service';
import { CurrencyCourse } from '../currencyCourse/currencyCourse.entity';
import { AccountResolver } from './account.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    TypeOrmModule.forFeature([Currency]),
    TypeOrmModule.forFeature([CurrencyCourse]),
    TypeOrmModule.forRoot(
      configService.getTypeOrmConfig() as TypeOrmModuleOptions,
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  providers: [
    AccountService,
    CurrencyService,
    CurrencyCourseService,
    AccountResolver,
  ],
})
export class AccountModule {}
