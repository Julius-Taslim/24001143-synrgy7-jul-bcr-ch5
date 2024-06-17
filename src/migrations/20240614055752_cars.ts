import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('cars', (table:Knex.TableBuilder)=>{
        table.increments('id').primary();
        table.string('name',200).notNullable();
        table.string('image_url');
        table.integer('price').notNullable();
        table.dateTime('start_rent').notNullable();
        table.dateTime('finish_rent').notNullable();
        table.dateTime('created_at');
        table.dateTime('updated_at');
    })
}

export async function down(knex: Knex): Promise<void> {
}

