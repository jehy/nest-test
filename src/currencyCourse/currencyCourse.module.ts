import { Module } from '@nestjs/common';
import { CurrencyCourseService } from './currencyCourse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyCourse } from './currencyCourse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyCourse])],
  providers: [CurrencyCourseService],
})
export class AccountModule {}
