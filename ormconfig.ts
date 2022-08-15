import { DataSource, DataSourceOptions } from 'typeorm';
import { configService } from './src/config/config.service';

const config = configService.getTypeOrmConfig();

export const AppDataSource = new DataSource(config as DataSourceOptions);
