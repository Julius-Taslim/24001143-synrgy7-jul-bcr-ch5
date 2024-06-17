import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('orders', (table:Knex.TableBuilder)=>{
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.integer('car_id').notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
}
