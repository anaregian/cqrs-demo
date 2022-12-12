import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Customer', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.string('email').unique();
  });

  await knex.schema.createTable('Order', function (table) {
    table.increments('id').primary();
    table.string('title');
    table.string('content');
    table.integer('customerId').unsigned().references('id').inTable('Customer');
  });

  await knex.schema.createTable('Part', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.string('description');
    table.string('quantity');
  });

  await knex.schema.createTable('OrderPart', function (table) {
    table.increments('id').primary();
    table.integer('partId').unsigned().references('id').inTable('Part');
    table.integer('orderId').unsigned().references('id').inTable('Order');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('OrderPart');
  await knex.schema.dropTable('Part');
  await knex.schema.dropTable('Order');
  await knex.schema.dropTable('Customer');
}
