import { Account } from './account.entity';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { NotFoundException } from '@nestjs/common';

@Resolver((of) => Account)
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  @Query((returns) => Number)
  async getAccountBalance(@Args('id', { type: () => Int }) id: number) {
    const account = await this.accountService.findById(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account.balance;
  }

  @Mutation((returns) => Boolean)
  async updateUser(
    @Args('from', { type: () => Int }) from: number,
    @Args('to', { type: () => Int }) to: number,
    @Args('amount', { type: () => Int }) amount: number,
    @Args('currency', { type: () => String }) currency = 'USD',
  ) {
    return this.accountService.transferBalanceById(from, to, amount, currency);
  }
}
