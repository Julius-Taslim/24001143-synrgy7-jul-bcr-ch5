import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table:Knex.TableBuilder)=>{
        table.increments('id').primary();
        table.string('username',50).notNullable();
        table.string('email', 50).notNullable();
        table.string('password', 30).notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
}
