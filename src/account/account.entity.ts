import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IsNumber, Min } from 'class-validator';
import { Currency } from '../currency/currency.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @IsNumber()
  @Min(0) // if we don't support credits :)
  balance: number;

  @ManyToOne(() => Currency, (currency) => currency.id)
  @JoinColumn({ name: 'currency' })
  currency: number;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
