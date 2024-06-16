import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('cars').del();

    // Inserts seed entries
    await knex('cars').insert([
        { id: 1, name: "Car1", price: 15000, start_rent: new Date('2024-06-01T10:00:00Z'), finish_rent: new Date('2024-06-10T10:00:00Z') },
        { id: 2, name: "Car2", price: 20000, start_rent: new Date('2024-07-01T10:00:00Z'), finish_rent: new Date('2024-07-10T10:00:00Z') },
        { id: 3, name: "Car3", price: 25000, start_rent: new Date('2024-08-01T10:00:00Z'), finish_rent: new Date('2024-08-10T10:00:00Z') }
    ]);
}