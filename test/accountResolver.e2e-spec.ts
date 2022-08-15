import { Test } from '@nestjs/testing';
import request from 'supertest';

import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from '../src/account/account.entity';
import { Currency } from '../src/currency/currency.entity';
import { CurrencyCourse } from '../src/currencyCourse/currencyCourse.entity';
import { configService } from '../src/config/config.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AccountService } from '../src/account/account.service';
import { CurrencyService } from '../src/currency/currency.service';
import { CurrencyCourseService } from '../src/currencyCourse/currencyCourse.service';
import { AccountResolver } from '../src/account/account.resolver';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should get balance', async () => {
    const query = '{getAccountBalance(id: 1)}';
    const { body } = await request(app.getHttpServer()).post('/graphql').send({
      query,
    });
    expect(body).toEqual({
      data: {
        getAccountBalance: 10.8,
      },
    });
  });
  it('should transfer balance', async () => {
    const query =
      'mutation{\n' +
      '  updateUser(from: 2, to: 3, amount: 30, currency: "USD")\n' +
      '}';
    const { body } = await request(app.getHttpServer()).post('/graphql').send({
      query,
    });
    expect(body).toEqual({
      data: {
        updateUser: true,
      },
    });
  });
});
