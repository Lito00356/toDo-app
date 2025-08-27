const tableName = "tasks";

export function up(knex) {
  return knex.schema.alterTable(tableName, function (table) {
    table.foreign("category_id").references("categories.id").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.alterTable(tableName, function (table) {
    table.dropForeign("category_id");
  });
}
