import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { IsNumber, Min } from 'class-validator';

@Entity()
export class CurrencyCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'from_id' })
  from: Currency;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'to_id' })
  to: Currency;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @IsNumber()
  @Min(0) // if we don't support credits :)
  course: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
