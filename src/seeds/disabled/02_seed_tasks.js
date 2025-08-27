const tableName = "tasks";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([
    { taskname: "Finish report", category_id: 1 },
    { taskname: "Email client", category_id: 1 },
    { taskname: "Prepare presentation", category_id: 1 },
    { taskname: "Call mom", category_id: 2 },
    { taskname: "Read a book", category_id: 2 },
    { taskname: "Go for a run", category_id: 3 },
  ]);
};

export { seed };
