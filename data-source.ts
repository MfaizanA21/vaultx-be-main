// data-source.ts
import { DataSource } from 'typeorm';
import { User } from './src/auth/entities/auth.entity';
import { Residence } from 'src/residence/entity/residence.entity';
import { Vehicle } from 'src/vehicle/entity/vehicle.entity';
import { Guest } from 'src/guest/entity/guest.entity';
import { Society } from 'src/society/entity/society.entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'vaultx-server.database.windows.net',
  port: 1433,
  username: 'vaultx-serv-ad',
  password: 'Vault_x_2025',
  database: 'vaultx_db',
  synchronize: false,
  logging: true,
  entities: [User, Residence, Vehicle, Guest, Society],
  migrations: ['src/migrations/*.ts'],
  options: {
    encrypt: true,
  },
});
