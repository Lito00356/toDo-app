const tableName = "tasks";

export function up(knex) {
  return knex.schema.alterTable(tableName, function (table) {
    table.integer("users_id").unsigned();
    table.foreign("users_id").references("users.id");
  });
}

export function down(knex) {
  return knex.schema.alterTable(tableName, function (table) {
    table.dropColumn("users_id");
    table.dropForeign("users_id");
  });
}
