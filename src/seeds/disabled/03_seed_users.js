const tableName = "users";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).truncate();
  await knex(tableName).insert([{ nickname: "qwery", email: "info@gmail.com", password: "$2b$10$JbtSiDJhJZvPQTO2ESzxQeP.iaXFGUWZUu.Ih2.g5q0NnzSkD2RFq" }]);
  await knex(tableName).insert([{ nickname: "jefke", email: "pizza@gmail.com", password: "$2b$10$CfCJvmUTCO4BIkmZUiMqueysOOV4XAfOs32EHLC.FhYU4Fk/vc46G" }]);
};

export { seed };
