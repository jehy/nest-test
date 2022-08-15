import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './currency.entity';
import { Logger } from '@nestjs/common';
@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}
  async findAll(): Promise<Currency[]> {
    return this.currencyRepository.find();
  }
  async findByTitle(title: string): Promise<Currency> {
    return this.currencyRepository.findOneBy({ title });
  }

  async create(currency: Currency): Promise<Currency> {
    return this.currencyRepository.save(currency);
  }
}
