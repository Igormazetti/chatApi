/* eslint-disable no-undef */
exports.up = function (knex) {
  return knex.schema
    .createTable('rooms', function (table) {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('rooms_members', function (table) {
      table
        .integer('room_id')
        .unsigned()
        .references('id')
        .inTable('rooms')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.primary(['room_id', 'user_id']);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .alterTable('messages', function (table) {
      table
        .integer('room_id')
        .unsigned()
        .references('id')
        .inTable('rooms')
        .onDelete('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('messages', function (table) {
      table.dropColumn('room_id');
    })
    .dropTable('rooms_members')
    .dropTable('rooms');
};
