const tableName = "categories";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("category").notNullable();
    table.string("slug").notNullable();
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
