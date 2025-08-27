const tableName = "users";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id");
    table.string("nickname", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
