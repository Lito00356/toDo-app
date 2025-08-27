const tableName = "categories";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { category: "work", slug: "work", users_id: 2 },
    { category: "personal", slug: "personal", users_id: 2 },
    { category: "fitness", slug: "fitness", users_id: 2 },
  ]);
};

export { seed };
