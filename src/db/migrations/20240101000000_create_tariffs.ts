import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wb_box_tariffs', (table) => {
    table.increments('id').primary();
    table.string('warehouse_name').notNullable();
    table.string('box_delivery_and_storage_expr').notNullable().defaultTo('0');
    table.decimal('box_delivery_base', 10, 2).notNullable().defaultTo(0);
    table.decimal('box_delivery_liter', 10, 2).notNullable().defaultTo(0);
    table.decimal('box_storage_base', 10, 2).notNullable().defaultTo(0);
    table.decimal('box_storage_liter', 10, 2).notNullable().defaultTo(0);
    table.date('date').notNullable();
    table.timestamps(true, true);

    // Уникальный ключ: один склад — одна запись в день
    table.unique(['warehouse_name', 'date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('wb_box_tariffs');
}
