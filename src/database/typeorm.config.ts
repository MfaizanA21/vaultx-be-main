import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Guest } from 'src/guest/entity/guest.entity';
import { Residence } from 'src/residence/entity/residence.entity';
import { Society } from 'src/society/entity/society.entity';
import { Vehicle } from 'src/vehicle/entity/vehicle.entity';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: 'vaultx-server.database.windows.net',
  port: 1433,
  username: 'vaultx-serv-ad',
  password: 'Vault_x_2025',
  database: 'vaultx_db',
  entities: [User, Residence, Vehicle, Guest, Society],
  synchronize: false,
  options: {
    encrypt: true,
  },
});
// Note: In a production environment, you should not use `synchronize: true` as it can lead to data loss. Instead, use migrations to manage your database schema changes.
// Also, ensure that sensitive information like database credentials is stored securely and not hardcoded in your source code. Use environment variables or a secrets management service.
// The above code is a TypeORM configuration for a NestJS application. It connects to a Microsoft SQL Server database and defines the User entity. The `synchronize` option is set to true for development purposes, but it should be set to false in production to avoid data loss. Sensitive information like database credentials should be stored securely.
// The `encrypt` option is set to false, which may not be suitable for production environments. Adjust this based on your security requirements.
