import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Logger } from '@nestjs/common';
import { Currency } from '../currency/currency.entity';
import { CurrencyService } from '../currency/currency.service';
import { CurrencyCourseService } from '../currencyCourse/currencyCourse.service';
@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private currencyService: CurrencyService,
    private currencyCourseService: CurrencyCourseService,
  ) {}
  async findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }
  async findById(id: number): Promise<Account> {
    return this.accountRepository.findOne({
      where: { account_id: id },
      loadRelationIds: true,
    });
  }

  async create(account: Account): Promise<Account> {
    return this.accountRepository.save(account);
  }
  async transferBalanceById(
    senderId: number,
    receiverId: number,
    amount: number,
    currencyName: string,
  ) {
    const [from, to, currency] = await Promise.all([
      this.findById(senderId),
      this.findById(receiverId),
      this.currencyService.findByTitle(currencyName),
    ]);
    if (!from) {
      throw new NotFoundException('Sender account not found');
    }
    if (!to) {
      throw new NotFoundException('Receiver account not found');
    }
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }
    return this.transferBalance(from, to, amount, currency);
  }
  async transferBalance(
    sender: Account,
    receiver: Account,
    amount: number,
    currency: Currency,
  ): Promise<boolean> {
    const senderCoeff = await this.currencyCourseService.findActual(
      sender.currency,
      currency.id,
    );
    const receiverCoeff = await this.currencyCourseService.findActual(
      receiver.currency,
      currency.id,
    );
    if (sender.balance < amount * senderCoeff) {
      throw new BadRequestException('Low balance');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const queryBuilder = this.dataSource.createQueryBuilder(queryRunner);
    try {
      await queryBuilder
        .update(Account)
        .set({
          balance: () => `balance - ${amount}*${senderCoeff}`,
        })
        .where('account_id = :id', { id: sender.account_id })
        .execute();
      await queryBuilder
        .update(Account)
        .set({
          balance: () => `balance + ${amount}*${receiverCoeff}`,
        })
        .where('account_id = :id', { id: receiver.account_id })
        .execute();

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
