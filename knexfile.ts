import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      user: 'postgres',
      password: 'julius',
      port: 5432,
      host: '127.0.0.1',
      database: 'db_ch5'
    },
    migrations: {
      directory: __dirname + '/src/migrations',
      extension:"ts",
    },
    seeds: {
      directory: __dirname + '/src/seeds',
      extension:"ts",
    },
  },
  // Add configurations for other environments if needed
};

export default config;
