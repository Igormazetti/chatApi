exports.up = function(knex) {
  return knex.schema.createTable('messages', function(table) {
    table.increments('id').primary();
    table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('receiver_id').unsigned().references('id').inTable('users').onDelete('CASCADE').nullable();
    table.text('text').notNullable();
    table.integer('reply_to').unsigned().references('id').inTable('messages').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
}; 