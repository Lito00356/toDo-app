const tableName = "tasks";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("taskName").notNullable().unique();
    table.integer("is_completed").defaultTo(0);
    table.integer("category_id").notNullable();
    table.timestamps(true, true);

    // Foreign Key
    table.foreign("category_id").references("categories.id");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
