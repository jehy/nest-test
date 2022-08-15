import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyCourse } from './currencyCourse.entity';
import { Logger } from '@nestjs/common';
@Injectable()
export class CurrencyCourseService {
  private readonly logger = new Logger(CurrencyCourseService.name);
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CurrencyCourse)
    private currencyCourseRepository: Repository<CurrencyCourse>,
  ) {}
  async findAll(): Promise<CurrencyCourse[]> {
    return this.currencyCourseRepository.find();
  }

  async create(currencyCourse: CurrencyCourse): Promise<CurrencyCourse> {
    return this.currencyCourseRepository.save(currencyCourse);
  }
  async findActual(from: number, to: number): Promise<number> {
    if (from === to) {
      return 1;
    }
    /*
    const [from, to] = await Promise.all([
        this.currencyRepository.findOneBy({ title: from }),
        this.currencyRepository.findOneBy({ title: to }),
        ]
    );*/
    const lastCourse = await this.currencyCourseRepository.findOne({
      where: {
        from: { id: from },
        to: { id: to },
      },
      order: {
        id: 'DESC',
      },
    });
    return lastCourse.course;
  }
}
