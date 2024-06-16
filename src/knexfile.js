"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
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
            extension: "ts",
        },
        seeds: {
            directory: __dirname + '/src/seeds',
            extension: "ts",
        },
    },
    // Add configurations for other environments if needed
};
exports.default = config;
