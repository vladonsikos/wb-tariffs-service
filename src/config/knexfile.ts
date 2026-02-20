import dotenv from 'dotenv';
dotenv.config();

const config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  migrations: {
    directory: '../db/migrations',
    extension: 'ts',
  },
};

export default config;
module.exports = config;
