import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const env = process.env.NODE_ENV;

const config: PostgresConnectionOptions =
  env === 'production'
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrations: ['dist/migrations/**/*.js'],
      }
    : {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'mediumuser',
        password: '123',
        database: 'medium_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrations: ['src/migrations/**/*.ts'],
      };

export default config;
